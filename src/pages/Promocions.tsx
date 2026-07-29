import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Tag } from "lucide-react";
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
import { promocionsService } from "@/services/promocionsService";
import { PromocioForm } from "@/components/backoffice/PromocioForm";
import { PromocioCards, PromocioTable } from "@/components/backoffice/PromocioList";
import { ErrorState } from "@/components/backoffice/ErrorState";
import type { Promocio, PromocioInput } from "@/types/merchant";

export default function PromocionsPage() {
  const { t } = useLang();
  const qc = useQueryClient();

  const listQ = useQuery({
    queryKey: ["promocions"],
    queryFn: () => promocionsService.list(),
  });

  const [editing, setEditing] = useState<Promocio | null>(null);
  const [creating, setCreating] = useState(false);
  const [toDelete, setToDelete] = useState<Promocio | null>(null);

  const invalidate = () => qc.invalidateQueries({ queryKey: ["promocions"] });

  const createMut = useMutation({
    mutationFn: (input: PromocioInput) => promocionsService.create(input),
    onSuccess: () => {
      invalidate();
      toast.success(t("toast.promo.saved"));
      setCreating(false);
    },
    onError: () => toast.error(t("toast.promo.saveError")),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, input }: { id: string; input: PromocioInput }) =>
      promocionsService.update(id, input),
    onSuccess: () => {
      invalidate();
      toast.success(t("toast.promo.saved"));
      setEditing(null);
    },
    onError: () => toast.error(t("toast.promo.saveError")),
  });

  const toggleMut = useMutation({
    mutationFn: ({ id, activa }: { id: string; activa: boolean }) =>
      promocionsService.toggle(id, activa),
    onSuccess: (_data, vars) => {
      invalidate();
      toast(vars.activa ? t("toast.promo.activated") : t("toast.promo.deactivated"));
    },
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => promocionsService.remove(id),
    onSuccess: () => {
      invalidate();
      toast.success(t("toast.promo.deleted"));
      setToDelete(null);
    },
  });

  const promocions = listQ.data ?? [];
  const submitting = createMut.isPending || updateMut.isPending;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{t("promos.title")}</h1>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground md:text-base">
            {t("promos.subtitle")}
          </p>
        </div>
        <Button onClick={() => setCreating(true)} className="shrink-0">
          <Plus className="h-4 w-4" />
          {t("promos.add")}
        </Button>
      </header>

      {listQ.isLoading ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      ) : listQ.error ? (
        <ErrorState onRetry={() => listQ.refetch()} />
      ) : promocions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-card p-10 text-center">
          <div className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-muted text-muted-foreground">
            <Tag className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold">{t("promos.empty.title")}</h3>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            {t("promos.empty.subtitle")}
          </p>
          <Button className="mt-4" onClick={() => setCreating(true)}>
            <Plus className="h-4 w-4" />
            {t("promos.addFirst")}
          </Button>
        </div>
      ) : (
        <>
          <PromocioTable
            promocions={promocions}
            onEdit={setEditing}
            onDelete={setToDelete}
            onToggle={(p, activa) => toggleMut.mutate({ id: p.id, activa })}
          />
          <PromocioCards
            promocions={promocions}
            onEdit={setEditing}
            onDelete={setToDelete}
            onToggle={(p, activa) => toggleMut.mutate({ id: p.id, activa })}
          />
        </>
      )}

      {/* Create sheet */}
      <Sheet open={creating} onOpenChange={(o) => (o ? setCreating(true) : setCreating(false))}>
        <SheetContent side="right" className="flex w-full flex-col gap-6 sm:max-w-lg">
          <SheetHeader className="text-left">
            <SheetTitle>{t("form.new.title")}</SheetTitle>
            <SheetDescription>{t("promos.subtitle")}</SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto pr-1">
            <PromocioForm
              onSubmit={(input) => createMut.mutateAsync(input)}
              onCancel={() => setCreating(false)}
              submitting={submitting}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit sheet */}
      <Sheet
        open={!!editing}
        onOpenChange={(o) => {
          if (!o) setEditing(null);
        }}
      >
        <SheetContent side="right" className="flex w-full flex-col gap-6 sm:max-w-lg">
          <SheetHeader className="text-left">
            <SheetTitle>{t("form.edit.title")}</SheetTitle>
            <SheetDescription>{editing?.titol}</SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto pr-1">
            {editing ? (
              <PromocioForm
                initial={editing}
                onSubmit={(input) => updateMut.mutateAsync({ id: editing.id, input })}
                onCancel={() => setEditing(null)}
                submitting={submitting}
              />
            ) : null}
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete confirmation */}
      <AlertDialog
        open={!!toDelete}
        onOpenChange={(o) => {
          if (!o) setToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("promos.confirmDelete.title")}</AlertDialogTitle>
            <AlertDialogDescription>{t("promos.confirmDelete.body")}</AlertDialogDescription>
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
