import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertTriangle, CheckCircle2, Phone, UserPlus } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ErrorState } from "@/components/backoffice/ErrorState";
import { useLang } from "@/contexts/LangContext";
import { cn } from "@/lib/utils";
import type { MessageKey } from "@/lib/i18n";
import type { ComercAdmin } from "@/types/backoffice";
import type { ShopReview } from "@/types/shopRequest";

export const REJECT_REASON_MAX = 500;
export const rejectReasonSchema = z.object({
  reason: z.string().trim().min(3).max(REJECT_REASON_MAX),
});

export type ShopCheck = { ok: boolean; key: MessageKey; names?: string[] };

export function shopChecks(r: ShopReview): ShopCheck[] {
  return [
    { ok: r.taxIdValid, key: r.taxIdValid ? "alta.check.taxIdOk" : "alta.check.taxIdBad" },
    { ok: r.postalCodeInTown, key: r.postalCodeInTown ? "alta.check.postalOk" : "alta.check.postalBad" },
    { ok: r.emailVerified, key: r.emailVerified ? "alta.check.emailOk" : "alta.check.emailBad" },
    r.sameTaxId.length
      ? { ok: false, key: "alta.check.sameTaxId", names: r.sameTaxId }
      : { ok: true, key: "alta.check.sameTaxIdNone" },
    r.similarNames.length
      ? { ok: false, key: "alta.check.similar", names: r.similarNames }
      : { ok: true, key: "alta.check.similarNone" },
  ];
}

export type ShopSheetPhase = "idle" | "approving" | "rejecting";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  comerc: ComercAdmin | null;
  loading: boolean;
  error: boolean;
  review: ShopReview | undefined;
  phase: ShopSheetPhase;
  notice: "approved" | "rejected" | "decided" | null;
  onApprove: () => void;
  onReject: (reason: string) => void;
  onRetry: () => void;
};

function formatDate(iso: string | undefined, lang: string): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat(lang === "en" ? "en-GB" : lang, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export function ShopRequestSheet(props: Props) {
  const { open, onOpenChange, comerc } = props;
  const { t } = useLang();
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col gap-6 sm:max-w-lg">
        <SheetHeader className="text-left">
          <SheetTitle>{t("alta.sheet.title")}</SheetTitle>
          <SheetDescription>{comerc?.nom}</SheetDescription>
        </SheetHeader>
        {comerc ? <ShopRequestSheetBody {...props} comerc={comerc} /> : null}
      </SheetContent>
    </Sheet>
  );
}

export function ShopRequestSheetBody({
  comerc,
  loading,
  error,
  review,
  phase,
  notice,
  onApprove,
  onReject,
  onRetry,
}: Props & { comerc: ComercAdmin }) {
  const { t, lang } = useLang();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);

  const form = useForm<z.infer<typeof rejectReasonSchema>>({
    resolver: zodResolver(rejectReasonSchema),
    defaultValues: { reason: "" },
  });
  const reasonLength = form.watch("reason").length;

  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }
  if (error || !review) return <ErrorState message={t("alta.sheet.error")} onRetry={onRetry} />;

  const busy = phase !== "idle";
  const decided = review.status === "approved" || notice === "approved" || notice === "decided";
  const rejected = review.status === "rejected" || notice === "rejected";

  const rows: { label: MessageKey; value: string }[] = [
    { label: "alta.field.name.label", value: comerc.nom },
    { label: "alta.field.taxId.label", value: comerc.taxId ?? "—" },
    { label: "alta.field.address.label", value: comerc.adreca ?? "—" },
    { label: "alta.sheet.postalTown", value: `${comerc.codiPostal ?? "—"} · ${comerc.poblacioNom ?? "—"}` },
    { label: "alta.field.phone.label", value: comerc.telefon ?? "—" },
    { label: "alta.field.email.label", value: comerc.emailContacte },
    { label: "alta.field.category.label", value: comerc.categories.join(", ") || "—" },
    { label: "alta.sheet.date", value: formatDate(comerc.dataSolicitud, lang) },
  ];

  return (
    <>
      <div className="flex flex-1 flex-col gap-5 overflow-y-auto pr-1">
        {notice ? (
          <Alert variant={notice === "decided" ? "destructive" : "default"}>
            <AlertDescription>
              {t(
                notice === "approved"
                  ? "alta.sheet.approved"
                  : notice === "rejected"
                    ? "alta.sheet.rejected"
                    : "alta.sheet.alreadyDecided",
              )}
            </AlertDescription>
          </Alert>
        ) : rejected ? (
          <Alert>
            <AlertDescription>{t("alta.sheet.status.rejected")}</AlertDescription>
          </Alert>
        ) : null}

        <section className="space-y-2">
          <p className="text-sm font-semibold">{t("alta.sheet.data")}</p>
          <dl className="divide-y rounded-lg border">
            {rows.map((r) => (
              <div key={r.label} className="grid grid-cols-[40%_1fr] gap-2 px-3 py-2 text-sm">
                <dt className="text-muted-foreground">{t(r.label)}</dt>
                <dd className="break-words font-medium">{r.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="space-y-2">
          <p className="text-sm font-semibold">{t("alta.sheet.checks")}</p>
          <ul className="space-y-2">
            {shopChecks(review).map((c) => (
              <li key={c.key} className="flex items-start gap-2 text-sm" data-check={c.ok ? "ok" : "warn"}>
                {c.ok ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-km0-teal-700" aria-label="✓" />
                ) : (
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-km0-yellow-400" aria-label="⚠" />
                )}
                <span className={cn(!c.ok && "font-medium")}>
                  {t(c.key).replace("{noms}", (c.names ?? []).join(", "))}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {review.invitedBy ? (
          <section className="flex items-start gap-2 rounded-lg border bg-muted/30 p-3 text-sm">
            <UserPlus className="mt-0.5 h-4 w-4 shrink-0 text-km0-blue-700" />
            <div>
              <p className="font-medium">{t("alta.sheet.invitedBy").replace("{nom}", review.invitedBy)}</p>
              <p className="text-muted-foreground">
                {t("alta.sheet.invitePoints").replace("{punts}", String(review.invitePoints))}
              </p>
            </div>
          </section>
        ) : null}

        <Alert>
          <Phone className="h-4 w-4" />
          <AlertDescription>{t("alta.sheet.callNote")}</AlertDescription>
        </Alert>
      </div>

      {!decided ? (
        <SheetFooter className="flex-row gap-2 sm:justify-end">
          {!rejected ? (
            <Button variant="outline" className="flex-1 sm:flex-none" disabled={busy} onClick={() => setRejectOpen(true)}>
              {phase === "rejecting" ? t("alta.sheet.rejecting") : t("alta.sheet.reject")}
            </Button>
          ) : null}
          <Button className="flex-1 sm:flex-none" disabled={busy} onClick={() => setConfirmOpen(true)}>
            {phase === "approving" ? t("alta.sheet.approving") : t("alta.sheet.approve")}
          </Button>
        </SheetFooter>
      ) : null}

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("alta.sheet.approveConfirm.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("alta.sheet.approveConfirm.body").replace("{nom}", comerc.nom)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={onApprove}>{t("alta.sheet.approve")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <form
            noValidate
            className="space-y-4"
            onSubmit={form.handleSubmit((v) => {
              setRejectOpen(false);
              onReject(v.reason.trim());
            })}
          >
            <DialogHeader>
              <DialogTitle>{t("alta.sheet.reject.title")}</DialogTitle>
              <DialogDescription>{t("alta.sheet.reject.help")}</DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <Label htmlFor="rejectReason">{t("alta.sheet.reject.reasonLabel")}</Label>
              <Textarea
                id="rejectReason"
                rows={5}
                maxLength={REJECT_REASON_MAX}
                aria-invalid={!!form.formState.errors.reason}
                {...form.register("reason")}
              />
              <div className="flex justify-between gap-2 text-xs">
                <span className="text-destructive">
                  {form.formState.errors.reason ? t("alta.sheet.reject.error") : null}
                </span>
                <span className="tabular-nums text-muted-foreground">
                  {t("alta.sheet.reject.counter").replace("{n}", String(reasonLength))}
                </span>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setRejectOpen(false)}>
                {t("common.cancel")}
              </Button>
              <Button type="submit" variant="destructive">
                {t("alta.sheet.reject")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
