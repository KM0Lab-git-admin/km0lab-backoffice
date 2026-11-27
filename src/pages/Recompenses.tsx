import { useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { Gift, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetDescription,
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
import { useLang } from "@/contexts/LangContext";
import { recompensesService } from "@/services/recompensesService";
import { RecompensaForm } from "@/components/backoffice/RecompensaForm";
import { RecompensaGrid, totesBloquejades } from "@/components/backoffice/RecompensaList";
import { ErrorState } from "@/components/backoffice/ErrorState";
import type { Recompensa, RecompensaInput } from "@/types/backoffice";

const recompensesKey = ["admin", "recompenses"] as const;

type EstatVars = { id: string; estat: "activa" | "inactiva" };

// Optimistic toggle: updates the cached list at once and restores it on failure.
export function recompensaEstatMutationOptions(qc: QueryClient, onFailure: () => void) {
  return {
    mutationFn: ({ id, estat }: EstatVars) => recompensesService.setEstat(id, estat),
    onMutate: async ({ id, estat }: EstatVars) => {
      await qc.cancelQueries({ queryKey: recompensesKey });
      const previous = qc.getQueryData<Recompensa[]>(recompensesKey);
      qc.setQueryData<Recompensa[]>(recompensesKey, (list) =>
        list?.map((r) => (r.id === id ? { ...r, estat } : r)),
      );
      return { previous };
    },
    onError: (_err: unknown, _vars: EstatVars, ctx: { previous?: Recompensa[] } | undefined) => {
      if (ctx?.previous) qc.setQueryData(recompensesKey, ctx.previous);
      onFailure();
    },
  };
}

export default function RecompensesPage() {
  const { t } = useLang();
  const qc = useQueryClient();

  const listQ = useQuery({
    queryKey: ["admin", "recompenses"],
    queryFn: () => recompensesService.list(),
  });

  const [editing, setEditing] = useState<Recompensa | null>(null);
  const [creating, setCreating] = useState(false);
  const [toDelete, setToDelete] = useState<Recompensa | null>(null);

  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin", "recompenses"] });

  const createMut = useMutation({
    mutationFn: (input: RecompensaInput) => recompensesService.create(input),
    onSuccess: () => {
      invalidate();
      toast.success(t("toast.recompensa.saved"));
      setCreating(false);
    },
    onError: () => toast.error(t("toast.recompensa.saveError")),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, input }: { id: string; input: RecompensaInput }) =>
      recompensesService.update(id, input),
    onSuccess: (updated) => {
      qc.setQueryData<Recompensa[]>(["admin", "recompenses"], (prev) =>
        prev?.map((r) => (r.id === updated.id ? updated : r)) ?? [updated],
      );
      invalidate();
      toast.success(t("toast.recompensa.saved"));
      setEditing(null);
    },
    onError: () => toast.error(t("toast.recompensa.saveError")),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => recompensesService.remove(id),
    onSuccess: () => {
      invalidate();
      toast.success(t("toast.recompensa.deleted"));
      setToDelete(null);
    },
  });

  const estatMut = useMutation(
    recompensaEstatMutationOptions(qc, () => toast.error(t("toast.recompensa.saveError"))),
  );

  const recompenses = listQ.data ?? [];
  const catalegComu = totesBloquejades(recompenses);
  const submitting = createMut.isPending || updateMut.isPending;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {t("recompenses.title")}
          </h1>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground md:text-base">
            {t("recompenses.subtitle")}
          </p>
          {catalegComu ? (
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
              {t("recompenses.catalegComu")}
            </p>
          ) : null}
        </div>
        {catalegComu ? null : (
          <Button onClick={() => setCreating(true)} className="shrink-0">
            <Plus className="h-4 w-4" />
            {t("recompenses.add")}
          </Button>
        )}
      </header>

      {listQ.isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-72" />
          <Skeleton className="h-72" />
          <Skeleton className="h-72" />
        </div>
      ) : listQ.error ? (
        <ErrorState onRetry={() => listQ.refetch()} />
      ) : recompenses.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-card p-10 text-center">
          <div className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-muted text-muted-foreground">
            <Gift className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold">{t("recompenses.empty.title")}</h3>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            {t("recompenses.empty.subtitle")}
          </p>
          <Button className="mt-4" onClick={() => setCreating(true)}>
            <Plus className="h-4 w-4" />
            {t("recompenses.addFirst")}
          </Button>
        </div>
      ) : (
        <RecompensaGrid
          recompenses={recompenses}
          onEdit={setEditing}
          onDelete={setToDelete}
          onToggleEstat={(r, activa) =>
            estatMut.mutate({ id: r.id, estat: activa ? "activa" : "inactiva" })
          }
          savingId={estatMut.isPending ? (estatMut.variables?.id ?? null) : null}
        />
      )}

      <Sheet open={creating} onOpenChange={(o) => setCreating(o)}>
        <SheetContent side="right" className="flex w-full flex-col gap-6 sm:max-w-lg">
          <SheetHeader className="text-left">
            <SheetTitle>{t("recompenses.form.new.title")}</SheetTitle>
            <SheetDescription>{t("recompenses.form.new.subtitle")}</SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto pr-1">
            <RecompensaForm
              onSubmit={(input) => createMut.mutateAsync(input)}
              onCancel={() => setCreating(false)}
              submitting={submitting}
            />
          </div>
        </SheetContent>
      </Sheet>

      <Sheet
        open={!!editing}
        onOpenChange={(o) => {
          if (!o) setEditing(null);
        }}
      >
        <SheetContent side="right" className="flex w-full flex-col gap-6 sm:max-w-lg">
          <SheetHeader className="text-left">
            <SheetTitle>{t("recompenses.form.edit.title")}</SheetTitle>
            <SheetDescription>{editing?.nom}</SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto pr-1">
            {editing ? (
              <RecompensaForm
                initial={editing}
                onSubmit={(input) => updateMut.mutateAsync({ id: editing.id, input })}
                onCancel={() => setEditing(null)}
                submitting={submitting}
              />
            ) : null}
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog
        open={!!toDelete}
        onOpenChange={(o) => {
          if (!o) setToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("recompenses.confirmDelete.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("recompenses.confirmDelete.body")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => toDelete && deleteMut.mutate(toDelete.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
