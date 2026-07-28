import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { FitxaForm } from "@/components/backoffice/FitxaForm";
import { FitxaPreview } from "@/components/backoffice/FitxaPreview";
import { FitxaListingPreview } from "@/components/backoffice/FitxaListingPreview";
import { ErrorState } from "@/components/backoffice/ErrorState";
import { fitxaService } from "@/services/fitxaService";
import { useLang } from "@/contexts/LangContext";
import type { ComercFitxa, ComercFitxaInput } from "@/types/comerc";

export default function LaMevaFitxa() {
  const { t } = useLang();
  const qc = useQueryClient();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["fitxa", "me"],
    queryFn: () => fitxaService.getFitxa(),
  });

  const [draft, setDraft] = useState<ComercFitxa | null>(null);

  useEffect(() => {
    if (data && !draft) setDraft(data);
  }, [data, draft]);

  const mutation = useMutation({
    mutationFn: (input: ComercFitxaInput) => fitxaService.updateFitxa(input),
    onSuccess: (saved) => {
      qc.setQueryData(["fitxa", "me"], saved);
      setDraft(saved);
      toast.success(t("fitxa.toast.saved"));
    },
    onError: () => {
      toast.error(t("fitxa.toast.error"));
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {t("fitxa.title")}
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          {t("fitxa.subtitle")}
        </p>
      </header>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="flex flex-col gap-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <Skeleton className="h-[560px] w-full rounded-3xl" />
        </div>
      ) : isError || !data || !draft ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <FitxaForm
            initial={data}
            onValuesChange={(v) => setDraft({ id: data.id, ...v })}
            onSubmit={(input) => mutation.mutateAsync(input)}
            submitting={mutation.isPending}
          />
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <div className="mb-3">
              <h2 className="text-sm font-bold">{t("fitxa.preview.title")}</h2>
              <p className="text-xs text-muted-foreground">
                {t("fitxa.preview.hint")}
              </p>
            </div>
            <div className="flex flex-col gap-5">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {t("fitxa.preview.listing.title")}
                </p>
                <p className="mb-2 text-xs text-muted-foreground">
                  {t("fitxa.preview.listing.hint")}
                </p>
                <FitxaListingPreview fitxa={draft} />
              </div>
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {t("fitxa.preview.detail.title")}
                </p>
                <FitxaPreview fitxa={draft} />
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
