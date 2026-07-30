import { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { I18nMap, Lang } from "@/types/i18n";
import { LANGS } from "@/types/i18n";

type Props = {
  id?: string;
  label?: string;
  value: I18nMap;
  sourceLang: Lang;
  onChange: (next: I18nMap) => void;
  onSourceLangChange?: (lang: Lang) => void;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

/**
 * Trilingual text field (ca/es/en). The active tab is the language being
 * edited; the source language can be set by clicking the tab label badge
 * (or via onSourceLangChange). Empty languages are auto-filled by the API
 * on save.
 */
export function I18nField({
  id,
  label,
  value,
  sourceLang,
  onChange,
  onSourceLangChange,
  multiline = false,
  rows = 3,
  placeholder,
  disabled,
  className,
}: Props) {
  const [active, setActive] = useState<Lang>(sourceLang);
  const filled = useMemo(
    () =>
      Object.fromEntries(
        LANGS.map((l) => [l, Boolean((value[l] ?? "").trim())]),
      ) as Record<Lang, boolean>,
    [value],
  );

  const Field = multiline ? Textarea : Input;

  return (
    <div className={cn("space-y-2", className)}>
      {label ? <p className="text-sm font-medium">{label}</p> : null}
      <Tabs value={active} onValueChange={(v) => setActive(v as Lang)}>
        <TabsList className="grid w-full grid-cols-3">
          {LANGS.map((lang) => (
            <TabsTrigger
              key={lang}
              value={lang}
              className="gap-1"
              onDoubleClick={() => onSourceLangChange?.(lang)}
              title={
                onSourceLangChange
                  ? "Doble clic per marcar com a idioma font"
                  : undefined
              }
            >
              <span>{lang.toUpperCase()}</span>
              {lang === sourceLang ? (
                <span className="rounded bg-primary/15 px-1 text-[10px] uppercase text-primary">
                  font
                </span>
              ) : filled[lang] ? null : (
                <span className="rounded bg-muted-foreground/15 px-1 text-[10px] uppercase">
                  auto
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
        {LANGS.map((lang) => (
          <TabsContent key={lang} value={lang}>
            <Field
              id={lang === active ? id : undefined}
              value={value[lang] ?? ""}
              placeholder={placeholder}
              disabled={disabled}
              rows={multiline ? rows : undefined}
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                onChange({ ...value, [lang]: e.target.value })
              }
            />
          </TabsContent>
        ))}
      </Tabs>
      {onSourceLangChange ? (
        <p className="text-xs text-muted-foreground">
          Idioma font: <strong>{sourceLang.toUpperCase()}</strong> (doble clic
          a una pestanya per canviar-lo). Els buits es tradueixen a l&apos;API.
        </p>
      ) : null}
    </div>
  );
}
