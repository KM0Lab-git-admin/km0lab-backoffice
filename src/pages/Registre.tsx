import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { AuthShell } from "@/components/backoffice/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLang } from "@/contexts/LangContext";
import { authService, MOCK_OTP_CODE, type RegisterInput } from "@/services/authService";
import { useAuthStore } from "@/stores/useAuthStore";
import { translate, type MessageKey } from "@/lib/i18n";

const registerSchema = z.object({
  nomComerc: z.string().trim().min(1),
  personaContacte: z.string().trim().min(1),
  email: z.string().trim().email(),
  telefon: z.string().trim().min(6),
  terms: z.literal(true),
});

type RegisterValues = z.infer<typeof registerSchema>;

export function RegistrePage() {
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const signIn = useAuthStore((s) => s.signIn);

  const [step, setStep] = useState<"form" | "otp">("form");
  const [pending, setPending] = useState<RegisterInput | null>(null);
  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [otpError, setOtpError] = useState<MessageKey | null>(null);

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nomComerc: "",
      personaContacte: "",
      email: "",
      telefon: "",
      terms: false as unknown as true,
    },
  });

  const onFormSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      const payload: RegisterInput = {
        nomComerc: values.nomComerc,
        personaContacte: values.personaContacte,
        email: values.email,
        telefon: values.telefon,
      };
      await authService.requestRegistration(payload);
      setPending(payload);
      setOtp("");
      setStep("otp");
      toast.success(t("auth.otp.sent"));
    } catch {
      toast.error(t("register.error.generic"));
    } finally {
      setSubmitting(false);
    }
  });

  async function onVerify() {
    if (!pending || otp.length !== 6) return;
    setSubmitting(true);
    setOtpError(null);
    try {
      const user = await authService.verifyRegistration(pending.email, otp);
      signIn(user);
      toast.success(t("register.toast.welcome"));
      navigate({ to: "/merchant/my-qr" });
    } catch {
      setOtpError("auth.otp.invalid");
    } finally {
      setSubmitting(false);
    }
  }

  async function onResend() {
    if (!pending) return;
    try {
      await authService.requestRegistration(pending);
      toast.success(t("auth.otp.sent"));
    } catch {
      toast.error(t("register.error.generic"));
    }
  }

  if (step === "otp" && pending) {
    return (
      <AuthShell
        title={t("register.title")}
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
                setOtpError(null);
              }}
              autoFocus
            >
              <InputOTPGroup>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTPGroup>
            </InputOTP>
            {otpError ? (
              <p className="text-sm text-destructive">{t(otpError)}</p>
            ) : null}
          </div>

          <Alert>
            <AlertDescription>
              {translate("auth.otp.hint", lang).replace("{codi}", MOCK_OTP_CODE)}
            </AlertDescription>
          </Alert>

          <Button
            type="button"
            onClick={onVerify}
            disabled={submitting || otp.length !== 6}
            className="w-full"
          >
            {submitting ? t("register.verifying") : t("register.verify")}
          </Button>

          <button
            type="button"
            onClick={onResend}
            className="w-full text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            {t("auth.otp.resend")}
          </button>
        </div>
      </AuthShell>
    );
  }

  const errors = form.formState.errors;

  return (
    <AuthShell
      title={t("register.title")}
      subtitle={t("register.subtitle")}
      footer={
        <>
          {t("register.toLogin.text")}{" "}
          <Link to="/login" className="font-medium text-foreground underline underline-offset-4">
            {t("register.toLogin.cta")}
          </Link>
        </>
      }
    >
      <form onSubmit={onFormSubmit} className="space-y-4" noValidate>
        <div className="space-y-2">
          <Label htmlFor="nomComerc">{t("register.nomComerc.label")}</Label>
          <Input
            id="nomComerc"
            placeholder={t("register.nomComerc.placeholder")}
            {...form.register("nomComerc")}
          />
          {errors.nomComerc ? (
            <p className="text-sm text-destructive">{t("register.error.required")}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="personaContacte">{t("register.persona.label")}</Label>
          <Input
            id="personaContacte"
            autoComplete="name"
            placeholder={t("register.persona.placeholder")}
            {...form.register("personaContacte")}
          />
          {errors.personaContacte ? (
            <p className="text-sm text-destructive">{t("register.error.required")}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">{t("register.email.label")}</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder={t("register.email.placeholder")}
            {...form.register("email")}
          />
          <p className="text-xs text-muted-foreground">{t("register.email.hint")}</p>
          {errors.email ? (
            <p className="text-sm text-destructive">{t("register.error.email")}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefon">{t("register.telefon.label")}</Label>
          <Input
            id="telefon"
            type="tel"
            autoComplete="tel"
            placeholder={t("register.telefon.placeholder")}
            {...form.register("telefon")}
          />
          {errors.telefon ? (
            <p className="text-sm text-destructive">{t("register.error.phone")}</p>
          ) : null}
        </div>

        <div className="flex items-start gap-2 pt-1">
          <Checkbox
            id="terms"
            checked={form.watch("terms") === true}
            onCheckedChange={(v) =>
              form.setValue("terms", (v === true) as true, { shouldValidate: true })
            }
          />
          <Label htmlFor="terms" className="text-sm font-normal leading-snug">
            {t("register.terms.label")}
          </Label>
        </div>
        {errors.terms ? (
          <p className="text-sm text-destructive">{t("register.error.terms")}</p>
        ) : null}

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? t("register.submitting") : t("register.submit")}
        </Button>
      </form>
    </AuthShell>
  );
}
