import { Badge } from "@/components/ui/badge";
import { useLang } from "@/contexts/LangContext";
import type { MessageKey } from "@/lib/i18n";
import type { SignupProvider } from "@/types/backoffice";

export const signupProviderKey: Record<SignupProvider, MessageKey> = {
  email_code: "origen.provider.email_code",
  google: "origen.provider.google",
  facebook: "origen.provider.facebook",
  apple: "origen.provider.apple",
};

export function SignupProviderBadge({ provider }: { provider: SignupProvider | null }) {
  const { t } = useLang();
  if (!provider) return <span className="text-xs text-muted-foreground">—</span>;
  return (
    <Badge variant="outline" className="font-medium">
      {t(signupProviderKey[provider])}
    </Badge>
  );
}
