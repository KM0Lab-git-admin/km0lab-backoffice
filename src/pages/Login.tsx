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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLang } from "@/contexts/LangContext";
import {
  authService,
  DEV_SKIP_OTP,
  MOCK_OTP_CODE,
} from "@/services/authService";
import { useAuthStore } from "@/stores/useAuthStore";
import { useSessionStore } from "@/stores/useSessionStore";
import { homePathForRol, rolFromRoles } from "@/lib/roles";
import { translate, type MessageKey } from "@/lib/i18n";

const emailSchema = z.object({
  email: z.string().trim().email(),
});

type EmailValues = z.infer<typeof emailSchema>;

export function LoginPage() {
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const signIn = useAuthStore((s) => s.signIn);
  const setSession = useSessionStore((s) => s.setSession);

  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [otpError, setOtpError] = useState<MessageKey | null>(null);

  const form = useForm<EmailValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  function applySession(
    session: Awaited<ReturnType<typeof authService.verifyLoginCode>>,
  ) {
    const rol = rolFromRoles(session.user.roles);
    signIn(session);
    setSession({
      rol,
      poblacioId: session.user.townId ?? "",
      comercId: session.user.shopId ?? undefined,
    });
    toast.success(t("login.toast.welcome"));
    navigate({ to: homePathForRol(rol) });
  }

  const onEmailSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      // Local only: demo emails enter in one step (no OTP screen).
      if (DEV_SKIP_OTP) {
        const session = await authService.verifyLoginCode(
          values.email,
          MOCK_OTP_CODE,
        );
        applySession(session);
        return;
      }
      await authService.requestLoginCode(values.email);
      setEmail(values.email);
      setOtp("");
      setStep("otp");
      toast.success(t("auth.otp.sent"));
    } catch (err) {
      console.error("[login] request-otp failed", err);
      const detail =
        err instanceof Error && err.message ? err.message : null;
      toast.error(detail ?? t("login.error.generic"));
    } finally {
      setSubmitting(false);
    }
  });

  async function onVerify() {
    if (otp.length !== 6) return;
    setSubmitting(true);
    setOtpError(null);
    try {
      const session = await authService.verifyLoginCode(email, otp);
      applySession(session);
    } catch (err) {
      const unreachable =
        err instanceof TypeError ||
        (err instanceof Error &&
          /failed to fetch|networkerror|load failed/i.test(err.message));
      if (unreachable) {
        toast.error(t("login.error.apiUnreachable"));
      } else {
        setOtpError("auth.otp.invalid");
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function onResend() {
    try {
      await authService.requestLoginCode(email);
      toast.success(t("auth.otp.sent"));
    } catch {
      toast.error(t("login.error.generic"));
    }
  }

  async function onDemoLogin(kind: "admin" | "merchant") {
    setSubmitting(true);
    try {
      const session = await authService.loginAsDemo(kind);
      applySession(session);
    } catch (err) {
      console.error("[login] demo bypass failed", err);
      const unreachable =
        err instanceof TypeError ||
        (err instanceof Error && /failed to fetch|networkerror|load failed/i.test(err.message));
      toast.error(
        unreachable ? t("login.error.apiUnreachable") : t("login.error.generic"),
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (step === "otp") {
    return (
      <AuthShell
        title={t("login.title")}
        subtitle={translate("auth.otp.subtitle", lang).replace("{email}", email)}
        footer={
          <button
            type="button"
            onClick={() => setStep("email")}
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

          {DEV_SKIP_OTP ? (
            <Alert>
              <AlertDescription>
                {translate("auth.otp.hint", lang).replace(
                  "{codi}",
                  MOCK_OTP_CODE,
                )}
              </AlertDescription>
            </Alert>
          ) : null}

          <Button
            type="button"
            onClick={onVerify}
            disabled={submitting || otp.length !== 6}
            className="w-full"
          >
            {submitting ? t("login.verifying") : t("login.verify")}
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

  return (
    <AuthShell
      title={t("login.title")}
      subtitle={t("login.subtitle")}
      footer={
        <>
          {t("login.toRegister.text")}{" "}
          <Link
            to="/register"
            className="font-medium text-foreground underline underline-offset-4"
          >
            {t("login.toRegister.cta")}
          </Link>
        </>
      }
    >
      <form onSubmit={onEmailSubmit} className="space-y-4" noValidate>
        <div className="space-y-2">
          <Label htmlFor="email">{t("login.email.label")}</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder={t("login.email.placeholder")}
            {...form.register("email")}
          />
          {form.formState.errors.email ? (
            <p className="text-sm text-destructive">{t("login.error.email")}</p>
          ) : null}
        </div>

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting
            ? t("login.verifying")
            : DEV_SKIP_OTP
              ? t("login.verify")
              : t("login.submit")}
        </Button>
      </form>

      {DEV_SKIP_OTP ? (
        <div className="mt-6 space-y-2 border-t pt-4">
          <p className="text-xs text-muted-foreground">{t("login.dev.hint")}</p>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={submitting}
            onClick={() => onDemoLogin("admin")}
          >
            {t("login.dev.admin")}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={submitting}
            onClick={() => onDemoLogin("merchant")}
          >
            {t("login.dev.merchant")}
          </Button>
        </div>
      ) : null}
    </AuthShell>
  );
}
