import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Zap } from "lucide-react";
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
import { accionsService } from "@/services/accionsService";
import { adminService } from "@/services/adminService";
import { AccioForm } from "@/components/backoffice/AccioForm";
import { AccioCards, AccioTable } from "@/components/backoffice/AccioList";
import { ErrorState } from "@/components/backoffice/ErrorState";
import type { AccioPunts, AccioPuntsInput } from "@/types/backoffice";

export default function AccionsPage() {
  const { t } = useLang();
  const qc = useQueryClient();

  const listQ = useQuery({
    queryKey: ["admin", "accions"],
    queryFn: () => accionsService.list(),
  });

  const meQ = useQuery({
    queryKey: ["admin", "me"],
    queryFn: () => adminService.getMe(),
  });

  const [editing, setEditing] = useState<AccioPunts | null>(null);
  const [creating, setCreating] = useState(false);
  const [toDelete, setToDelete] = useState<AccioPunts | null>(null);

  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin", "accions"] });

  const createMut = useMutation({
    mutationFn: (input: AccioPuntsInput) => accionsService.create(input),
    onSuccess: () => {
      invalidate();
      toast.success(t("toast.accio.saved"));
      setCreating(false);
    },
    onError: () => toast.error(t("toast.accio.saveError")),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, input }: { id: string; input: AccioPuntsInput }) =>
      accionsService.update(id, input),
    onSuccess: () => {
      invalidate();
      toast.success(t("toast.accio.saved"));
      setEditing(null);
    },
    onError: () => toast.error(t("toast.accio.saveError")),
  });

  const toggleMut = useMutation({
    mutationFn: ({ id, activa }: { id: string; activa: boolean }) =>
      accionsService.toggle(id, activa),
    onSuccess: (_d, vars) => {
      invalidate();
      toast(vars.activa ? t("toast.accio.activated") : t("toast.accio.deactivated"));
    },
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => accionsService.remove(id),
    onSuccess: () => {
      invalidate();
      toast.success(t("toast.accio.deleted"));
      setToDelete(null);
    },
    onError: () => toast.error(t("toast.accio.saveError")),
  });

  const accions = listQ.data ?? [];
  const submitting = createMut.isPending || updateMut.isPending;
  const poblacio = meQ.data?.poblacioNom ?? "";

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {t("accions.title")}
          </h1>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground md:text-base">
            {poblacio
              ? t("accions.subtitle").replace("{poblacio}", poblacio)
              : t("accions.subtitle.generic")}
          </p>
        </div>
        <Button onClick={() => setCreating(true)} className="shrink-0">
          <Plus className="h-4 w-4" />
          {t("accions.add")}
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
      ) : accions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-card p-10 text-center">
          <div className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-muted text-muted-foreground">
            <Zap className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold">{t("accions.empty.title")}</h3>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            {t("accions.empty.subtitle")}
          </p>
          <Button className="mt-4" onClick={() => setCreating(true)}>
            <Plus className="h-4 w-4" />
            {t("accions.addFirst")}
          </Button>
        </div>
      ) : (
        <>
          <AccioTable
            accions={accions}
            onEdit={setEditing}
            onDelete={setToDelete}
            onToggle={(a, v) => toggleMut.mutate({ id: a.id, activa: v })}
          />
          <AccioCards
            accions={accions}
            onEdit={setEditing}
            onDelete={setToDelete}
            onToggle={(a, v) => toggleMut.mutate({ id: a.id, activa: v })}
          />
        </>
      )}

      <Sheet open={creating} onOpenChange={(o) => setCreating(o)}>
        <SheetContent side="right" className="flex w-full flex-col gap-6 sm:max-w-lg">
          <SheetHeader className="text-left">
            <SheetTitle>{t("accions.form.new.title")}</SheetTitle>
            <SheetDescription>{t("accions.form.new.subtitle")}</SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto pr-1">
            <AccioForm
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
            <SheetTitle>{t("accions.form.edit.title")}</SheetTitle>
            <SheetDescription>{editing?.nom}</SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto pr-1">
            {editing ? (
              <AccioForm
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
            <AlertDialogTitle>{t("accions.confirmDelete.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("accions.confirmDelete.body")}
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
