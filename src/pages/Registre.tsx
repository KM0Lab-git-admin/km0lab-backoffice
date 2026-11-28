import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { CheckCircle2, UserPlus } from "lucide-react";
import { AuthShell } from "@/components/backoffice/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLang } from "@/contexts/LangContext";
import { DEV_SKIP_OTP, MOCK_OTP_CODE } from "@/services/authService";
import {
  isValidTaxId,
  requestShopRequestCode,
  submitShopRequest,
  verifyShopRequestCode,
} from "@/services/mock/shopRequestService";
import { useInviteCode } from "@/hooks/useInviteCode";
import { legalUrl, TERMS_VERSION, type LegalRouteKey } from "@/data/legalRoutes";
import { CATEGORIES_FITXA } from "@/data/fixtures/categoriesFitxa";
import { categorySlugToLabel } from "@/lib/mappers/categories";
import { fitxaService } from "@/services/fitxaService";
import { translate, type MessageKey } from "@/lib/i18n";
import type { ShopRequestErrorCode, ShopRequestInput } from "@/types/shopRequest";

export const registreSchema = z.object({
  name: z.string().trim().min(1, "alta.error.required"),
  taxId: z
    .string()
    .trim()
    .min(1, "alta.error.required")
    .refine((v) => isValidTaxId(v), "alta.error.taxIdFormat"),
  postalCode: z.string().trim().min(1, "alta.error.required"),
  address: z.string().trim().min(1, "alta.error.required"),
  phone: z.string().trim().min(1, "alta.error.required"),
  category: z.string().optional(),
  email: z.string().trim().min(1, "alta.error.required").email("alta.error.email"),
  terms: z.boolean().refine((v) => v, "alta.error.terms"),
});

export type RegistreValues = z.infer<typeof registreSchema>;
type FieldName = Exclude<keyof RegistreValues, "terms" | "category">;

// Server error code → field and message. `null` = generic error with "Retry".
export function shopRequestErrorField(
  code: ShopRequestErrorCode,
): { field: FieldName; message: MessageKey } | null {
  switch (code) {
    case "tax_id_invalid":
      return { field: "taxId", message: "alta.error.taxIdFormat" };
    case "tax_id_taken":
      return { field: "taxId", message: "alta.error.taxIdTaken" };
    case "postal_code_unknown":
      return { field: "postalCode", message: "alta.error.postalUnknown" };
    case "postal_code_not_allowed":
      return { field: "postalCode", message: "alta.error.postalNotAllowed" };
    case "email_taken":
      return { field: "email", message: "alta.error.emailTaken" };
    case "generic":
      return null;
  }
}

export function buildShopRequestInput(values: RegistreValues, inviteCode: string | undefined): ShopRequestInput {
  return {
    name: values.name.trim(),
    taxId: values.taxId.trim(),
    postalCode: values.postalCode.trim(),
    address: values.address.trim(),
    phone: values.phone.trim(),
    ...(values.category ? { category: values.category } : {}),
    email: values.email.trim(),
    termsVersion: TERMS_VERSION,
    ...(inviteCode ? { inviteCode } : {}),
  };
}

// Renders copy where "[text]" is a link to the given legal page (new tab).
export function LinkedText({ text, to }: { text: string; to: LegalRouteKey }) {
  const match = /^(.*)\[(.+)\](.*)$/s.exec(text);
  if (!match) return <>{text}</>;
  return (
    <>
      {match[1]}
      <a
        href={legalUrl(to)}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-foreground underline underline-offset-4"
      >
        {match[2]}
      </a>
      {match[3]}
    </>
  );
}

type Step = "form" | "otp" | "sending" | "done";

export function RegistrePage() {
  const { t, lang } = useLang();
  const inviteCode = useInviteCode();

  const [step, setStep] = useState<Step>("form");
  const [pending, setPending] = useState<RegistreValues | null>(null);
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [genericError, setGenericError] = useState(false);

  // Production: the categories are the API's catalogue, named in the
  // language of the screen (the same list the shop's profile offers).
  const categoriesQ = useQuery({
    queryKey: ["shop-categories", lang],
    queryFn: () => fitxaService.listCategories(lang),
    staleTime: 60_000,
  });
  const categoryOptions = (
    categoriesQ.data?.filter((c) => c.active).map((c) => ({
      slug: c.slug,
      label: [c.emoji, c.label ?? categorySlugToLabel(c.slug)].filter(Boolean).join(" "),
    })) ?? CATEGORIES_FITXA.map((slug) => ({ slug, label: categorySlugToLabel(slug) }))
  );

  const form = useForm<RegistreValues>({
    resolver: zodResolver(registreSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      taxId: "",
      postalCode: "",
      address: "",
      phone: "",
      category: undefined,
      email: "",
      terms: false,
    },
  });
  const errors = form.formState.errors;

  async function send(values: RegistreValues) {
    setStep("sending");
    setGenericError(false);
    const result = await submitShopRequest(buildShopRequestInput(values, inviteCode));
    if (result.ok) {
      setStep("done");
      return;
    }
    setStep("form");
    const mapped = shopRequestErrorField(result.error);
    if (mapped) form.setError(mapped.field, { type: "server", message: mapped.message });
    else setGenericError(true);
  }

  const onFormSubmit = form.handleSubmit(async (values) => {
    setPending(values);
    if (verifiedEmail === values.email.trim()) {
      await send(values);
      return;
    }
    setBusy(true);
    try {
      await requestShopRequestCode(values.email.trim());
      setOtp("");
      setOtpError(false);
      setStep("otp");
      toast.success(t("auth.otp.sent"));
    } catch {
      setGenericError(true);
    } finally {
      setBusy(false);
    }
  });

  async function onVerify() {
    if (!pending || otp.length !== 6) return;
    setBusy(true);
    const ok = await verifyShopRequestCode(pending.email.trim(), otp);
    setBusy(false);
    if (!ok) {
      setOtpError(true);
      return;
    }
    setVerifiedEmail(pending.email.trim());
    await send(pending);
  }

  const footer = (
    <>
      {t("register.toLogin.text")}{" "}
      <Link to="/login" className="font-medium text-foreground underline underline-offset-4">
        {t("register.toLogin.cta")}
      </Link>
    </>
  );

  if (step === "done") {
    return (
      <AuthShell title={t("alta.done.title")}>
        <div className="space-y-5">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-km0-teal-700" />
            <p className="text-sm">{t("alta.done.body")}</p>
          </div>
          <Button asChild variant="outline" className="w-full">
            <Link to="/login">{t("alta.done.toLogin")}</Link>
          </Button>
        </div>
      </AuthShell>
    );
  }

  if ((step === "otp" || step === "sending") && pending) {
    return (
      <AuthShell
        title={t("alta.title")}
        subtitle={translate("auth.otp.subtitle", lang).replace("{email}", pending.email)}
        footer={
          <button
            type="button"
            onClick={() => setStep("form")}
            className="underline underline-offset-4 hover:text-foreground"
          >
            {t("auth.otp.change")}
          </button>
        }
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp">{t("auth.otp.label")}</Label>
            <InputOTP
              id="otp"
              maxLength={6}
              value={otp}
              onChange={(v) => {
                setOtp(v);
                setOtpError(false);
              }}
              disabled={step === "sending"}
              autoFocus
            >
              <InputOTPGroup>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTPGroup>
            </InputOTP>
            {otpError ? <p className="text-sm text-destructive">{t("auth.otp.invalid")}</p> : null}
          </div>
          {/* Production: the prototype's fixed code is only named in local development. */}
          {DEV_SKIP_OTP ? (
            <Alert>
              <AlertDescription>
                {translate("auth.otp.hint", lang).replace("{codi}", MOCK_OTP_CODE)}
              </AlertDescription>
            </Alert>
          ) : null}
          <Button
            type="button"
            onClick={onVerify}
            disabled={busy || step === "sending" || otp.length !== 6}
            className="w-full"
          >
            {step === "sending" ? t("alta.sending") : busy ? t("register.verifying") : t("alta.otp.verify")}
          </Button>
          <button
            type="button"
            onClick={() => requestShopRequestCode(pending.email).then(() => toast.success(t("auth.otp.sent")))}
            className="w-full text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            {t("auth.otp.resend")}
          </button>
        </div>
      </AuthShell>
    );
  }

  const fieldError = (name: FieldName) => {
    const msg = errors[name]?.message;
    return msg ? <p className="text-sm text-destructive">{t(msg as MessageKey)}</p> : null;
  };

  return (
    <AuthShell title={t("alta.title")} subtitle={t("alta.subtitle")} footer={footer}>
      <form onSubmit={onFormSubmit} className="space-y-4" noValidate>
        {inviteCode ? (
          <Alert>
            <UserPlus className="h-4 w-4" />
            <AlertDescription>{t("alta.invite.line")}</AlertDescription>
          </Alert>
        ) : null}

        {genericError ? (
          <Alert variant="destructive">
            <AlertDescription className="flex flex-wrap items-center justify-between gap-2">
              <span>{t("alta.error.generic")}</span>
              <Button type="submit" size="sm" variant="outline">
                {t("alta.error.retry")}
              </Button>
            </AlertDescription>
          </Alert>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="name">{t("alta.field.name.label")}</Label>
          <Input id="name" placeholder={t("alta.field.name.placeholder")} aria-invalid={!!errors.name} {...form.register("name")} />
          {fieldError("name")}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="taxId">{t("alta.field.taxId.label")}</Label>
            <Input id="taxId" placeholder={t("alta.field.taxId.placeholder")} aria-invalid={!!errors.taxId} {...form.register("taxId")} />
            {fieldError("taxId")}
          </div>
          <div className="space-y-2">
            <Label htmlFor="postalCode">{t("alta.field.postalCode.label")}</Label>
            <Input id="postalCode" inputMode="numeric" autoComplete="postal-code" aria-invalid={!!errors.postalCode} {...form.register("postalCode")} />
            {fieldError("postalCode")}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">{t("alta.field.address.label")}</Label>
          <Input id="address" autoComplete="street-address" placeholder={t("alta.field.address.placeholder")} aria-invalid={!!errors.address} {...form.register("address")} />
          {fieldError("address")}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">{t("alta.field.phone.label")}</Label>
          <Input id="phone" type="tel" autoComplete="tel" aria-invalid={!!errors.phone} {...form.register("phone")} />
          <p className="text-xs text-muted-foreground">{t("alta.field.phone.help")}</p>
          {fieldError("phone")}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">{t("alta.field.category.label")}</Label>
          <Select value={form.watch("category") ?? ""} onValueChange={(v) => form.setValue("category", v)}>
            <SelectTrigger id="category">
              <SelectValue placeholder={t("alta.field.category.placeholder")} />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((c) => (
                <SelectItem key={c.slug} value={c.slug}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">{t("alta.field.email.label")}</Label>
          <Input id="email" type="email" autoComplete="email" aria-invalid={!!errors.email} {...form.register("email")} />
          <p className="text-xs text-muted-foreground">{t("alta.field.email.help")}</p>
          {fieldError("email")}
          {errors.email?.message === "alta.error.emailTaken" ? (
            <Link to="/login" className="text-sm font-medium underline underline-offset-4">
              {t("alta.error.emailTaken.cta")}
            </Link>
          ) : null}
        </div>

        <div className="space-y-2 rounded-lg border bg-muted/30 p-3">
          <div className="flex items-start gap-2">
            <Checkbox
              id="terms"
              checked={form.watch("terms")}
              onCheckedChange={(v) => form.setValue("terms", v === true, { shouldValidate: true })}
              aria-invalid={!!errors.terms}
            />
            <Label htmlFor="terms" className="text-sm font-normal leading-snug">
              <LinkedText text={t("alta.terms.label")} to="shopTerms" />
            </Label>
          </div>
          {errors.terms ? <p className="text-sm text-destructive">{t("alta.error.terms")}</p> : null}
          <p className="text-xs text-muted-foreground">
            <LinkedText text={t("alta.terms.notice")} to="privacy" />
          </p>
        </div>

        <p className="text-xs text-muted-foreground">{t("alta.review.notice")}</p>

        <Button type="submit" disabled={busy} className="w-full">
          {busy ? t("alta.submitting") : t("alta.submit")}
        </Button>
      </form>
    </AuthShell>
  );
}
