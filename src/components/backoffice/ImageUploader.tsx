import { useRef, useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/contexts/LangContext";
import { toast } from "sonner";

type Props = {
  value?: string;
  onChange: (dataUrl: string | undefined) => void;
  aspect: "square" | "hero";
  label: string;
  hint: string;
  recommendation?: string;
  placeholderLabel: string;
};

const MAX_BYTES = 5 * 1024 * 1024;

export function ImageUploader({
  value,
  onChange,
  aspect,
  label,
  hint,
  recommendation,
  placeholderLabel,
}: Props) {
  const { t } = useLang();
  const inputRef = useRef<HTMLInputElement>(null);
  const [reading, setReading] = useState(false);

  const handleFile = (file: File) => {
    if (file.size > MAX_BYTES) {
      toast.error(t("fitxa.error.imageTooLarge"));
      return;
    }
    setReading(true);
    const reader = new FileReader();
    reader.onload = () => {
      onChange(typeof reader.result === "string" ? reader.result : undefined);
      setReading(false);
    };
    reader.onerror = () => setReading(false);
    reader.readAsDataURL(file);
  };

  const boxClass =
    aspect === "square"
      ? "aspect-square w-32"
      : "aspect-[16/9] w-full max-w-md";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-xs text-muted-foreground">{hint}</span>
        {recommendation ? (
          <span className="text-xs font-medium text-km0-blue-700">{recommendation}</span>
        ) : null}
      </div>

      <div className={`${boxClass} overflow-hidden rounded-xl border bg-muted/40`}>
        {value ? (
          <img src={value} alt={label} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-center text-muted-foreground">
            <ImagePlus className="h-6 w-6" aria-hidden />
            <span className="px-2 text-xs">{placeholderLabel}</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={reading}
        >
          <ImagePlus className="mr-1.5 h-4 w-4" />
          {value ? t("fitxa.replace") : t("fitxa.upload")}
        </Button>
        {value ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange(undefined)}
          >
            <Trash2 className="mr-1.5 h-4 w-4" />
            {t("fitxa.remove")}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
