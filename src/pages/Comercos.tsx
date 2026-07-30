import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Plus, Search, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useLang } from "@/contexts/LangContext";
import { adminComercosService } from "@/services/adminComercosService";
import { ComercoForm } from "@/components/backoffice/ComercoForm";
import { ComercoCards, ComercoTable } from "@/components/backoffice/ComercoList";
import { ErrorState } from "@/components/backoffice/ErrorState";
import { useSessionStore } from "@/stores/useSessionStore";
import { adminService } from "@/services/adminService";
import type {
  ComercAdmin,
  ComercAdminInput,
  ComercEstat,
} from "@/types/backoffice";

type EstatFilter = "tots" | ComercEstat;

export default function ComercosPage() {
  const { t } = useLang();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const poblacioId = useSessionStore((s) => s.poblacioId);
  const enterActingAsShop = useSessionStore((s) => s.enterActingAsShop);

  const meQ = useQuery({
    queryKey: ["admin", "me"],
    queryFn: () => adminService.getMe(),
  });

  const listQ = useQuery({
    queryKey: ["admin", "comercos", poblacioId],
    queryFn: () => adminComercosService.list(),
  });

  const [editing, setEditing] = useState<ComercAdmin | null>(null);
  const [creating, setCreating] = useState(false);
  const [query, setQuery] = useState("");
  const [estatFilter, setEstatFilter] = useState<EstatFilter>("tots");

  const invalidate = () =>
    qc.invalidateQueries({ queryKey: ["admin", "comercos"] });

  const createMut = useMutation({
    mutationFn: (input: ComercAdminInput) => adminComercosService.create(input),
    onSuccess: () => {
      invalidate();
      toast.success(t("toast.comerc.invited"));
      setCreating(false);
    },
    onError: () => toast.error(t("toast.comerc.saveError")),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, input }: { id: string; input: ComercAdminInput }) =>
      adminComercosService.update(id, input),
    onSuccess: () => {
      invalidate();
      toast.success(t("toast.comerc.saved"));
      setEditing(null);
    },
    onError: () => toast.error(t("toast.comerc.saveError")),
  });

  const toggleMut = useMutation({
    mutationFn: ({ id, estat }: { id: string; estat: ComercEstat }) =>
      adminComercosService.setEstat(id, estat),
    onSuccess: (_d, vars) => {
      invalidate();
      toast(
        vars.estat === "actiu"
          ? t("toast.comerc.activated")
          : t("toast.comerc.deactivated"),
      );
    },
  });

  const comercos = listQ.data ?? [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return comercos.filter((c) => {
      if (estatFilter !== "tots" && c.estat !== estatFilter) return false;
      if (!q) return true;
      return (
        c.nom.toLowerCase().includes(q) ||
        c.categories.some((cat) => cat.toLowerCase().includes(q)) ||
        c.emailContacte.toLowerCase().includes(q)
      );
    });
  }, [comercos, query, estatFilter]);

  const submitting = createMut.isPending || updateMut.isPending;
  const poblacioNom = meQ.data?.poblacioNom ?? "";

  const handleToggle = (c: ComercAdmin, next: boolean) => {
    toggleMut.mutate({ id: c.id, estat: next ? "actiu" : "inactiu" });
  };

  const handleActAs = (c: ComercAdmin) => {
    enterActingAsShop({ id: c.id, nom: c.nom });
    void navigate({ to: "/merchant/my-qr" });
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {t("comercos.title")}
          </h1>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground md:text-base">
            {t("comercos.subtitle").replace("{poblacio}", poblacioNom)}
          </p>
        </div>
        <Button onClick={() => setCreating(true)} className="shrink-0">
          <Plus className="h-4 w-4" />
          {t("comercos.add")}
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
      ) : comercos.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-card p-10 text-center">
          <div className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-muted text-muted-foreground">
            <Store className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold">{t("comercos.empty.title")}</h3>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            {t("comercos.empty.subtitle")}
          </p>
          <Button className="mt-4" onClick={() => setCreating(true)}>
            <Plus className="h-4 w-4" />
            {t("comercos.addFirst")}
          </Button>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("comercos.search.placeholder")}
                className="pl-9"
                aria-label={t("comercos.search.placeholder")}
              />
            </div>
            <Select
              value={estatFilter}
              onValueChange={(v) => setEstatFilter(v as EstatFilter)}
            >
              <SelectTrigger className="sm:w-52">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tots">{t("comercos.filter.all")}</SelectItem>
                <SelectItem value="actiu">{t("comercos.estat.actiu")}</SelectItem>
                <SelectItem value="inactiu">{t("comercos.estat.inactiu")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-lg border border-dashed bg-card p-8 text-center text-sm text-muted-foreground">
              {t("comercos.filter.noResults")}
            </div>
          ) : (
            <>
              <ComercoTable
                comercos={filtered}
                onEdit={setEditing}
                onToggle={handleToggle}
                onActAs={handleActAs}
              />
              <ComercoCards
                comercos={filtered}
                onEdit={setEditing}
                onToggle={handleToggle}
                onActAs={handleActAs}
              />
            </>
          )}
        </>
      )}

      <Sheet open={creating} onOpenChange={(o) => setCreating(o)}>
        <SheetContent side="right" className="flex w-full flex-col gap-6 sm:max-w-lg">
          <SheetHeader className="text-left">
            <SheetTitle>{t("comercos.form.new.title")}</SheetTitle>
            <SheetDescription>{t("comercos.form.new.subtitle")}</SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto pr-1">
            <ComercoForm
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
            <SheetTitle>{t("comercos.form.edit.title")}</SheetTitle>
            <SheetDescription>{editing?.nom}</SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto pr-1">
            {editing ? (
              <ComercoForm
                initial={editing}
                onSubmit={(input) =>
                  updateMut.mutateAsync({ id: editing.id, input })
                }
                onCancel={() => setEditing(null)}
                submitting={submitting}
              />
            ) : null}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
