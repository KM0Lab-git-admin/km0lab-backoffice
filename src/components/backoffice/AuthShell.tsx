import type { ReactNode } from "react";
import { useLang } from "@/contexts/LangContext";
import { LangSwitcher } from "@/components/backoffice/LangSwitcher";

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthShell({ title, subtitle, children, footer }: Props) {
  const { t } = useLang();
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 md:px-8">
        <header className="flex items-center justify-between">
          <span className="inline-flex items-center rounded-md bg-km0-blue-700 px-2.5 py-1 text-sm font-black tracking-wide text-km0-beige-100">
            {t("app.brand")}
          </span>
          <LangSwitcher />
        </header>

        <main className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-md">
            <div className="rounded-2xl border bg-card p-6 shadow-sm md:p-8">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
              {subtitle ? (
                <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
              ) : null}
              <div className="mt-6">{children}</div>
            </div>
            {footer ? (
              <div className="mt-4 text-center text-sm text-muted-foreground">{footer}</div>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
}
