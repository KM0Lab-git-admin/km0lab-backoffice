// First-access welcome for shops (separable module).
import { useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fitxaService } from "@/services/fitxaService";
import { promocionsService } from "@/services/promocionsService";
import type { ComercFitxa } from "@/types/merchant";
import type { WelcomeStep } from "@/types/shopRequest";

const POSTER_KEY = "km0lab.welcome.posterDone";
const DISMISSED_SESSION_KEY = "km0lab.welcome.dismissed";
const FINISHED_KEY = "km0lab.welcome.finished";
const CHANGE_EVENT = "km0lab:welcome-change";

type Forced = "new" | "partial" | "complete" | null;

function readForced(): Forced {
  if (typeof window === "undefined") return null;
  const v = new URLSearchParams(window.location.search).get("welcome");
  return v === "new" || v === "partial" || v === "complete" ? v : null;
}

export function isProfileDone(fitxa: Pick<ComercFitxa, "logoUrl" | "horari"> | undefined): boolean {
  if (!fitxa) return false;
  return !!fitxa.logoUrl && Object.values(fitxa.horari).some((d) => !d.tancat);
}

export function buildWelcomeSteps(profile: boolean, promotion: boolean, poster: boolean): WelcomeStep[] {
  return [
    { id: "profile", done: profile },
    { id: "promotion", done: promotion },
    { id: "poster", done: poster },
  ];
}

export function readPosterDone(storage: Pick<Storage, "getItem">): boolean {
  return storage.getItem(POSTER_KEY) === "1";
}

export function writePosterDone(storage: Pick<Storage, "setItem">): void {
  storage.setItem(POSTER_KEY, "1");
}

export function useMerchantWelcome() {
  const fitxaQ = useQuery({ queryKey: ["fitxa", "me"], queryFn: () => fitxaService.getFitxa() });
  const promosQ = useQuery({ queryKey: ["promocions"], queryFn: () => promocionsService.list() });

  const [poster, setPoster] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [finished, setFinished] = useState(false);
  const [forced, setForced] = useState<Forced>(null);

  useEffect(() => {
    const sync = () => {
      setPoster(readPosterDone(window.localStorage));
      setDismissed(window.sessionStorage.getItem(DISMISSED_SESSION_KEY) === "1");
      setFinished(window.localStorage.getItem(FINISHED_KEY) === "1");
    };
    setForced(readForced());
    sync();
    window.addEventListener(CHANGE_EVENT, sync);
    return () => window.removeEventListener(CHANGE_EVENT, sync);
  }, []);

  const notify = () => window.dispatchEvent(new Event(CHANGE_EVENT));

  const markPosterDone = useCallback(() => {
    writePosterDone(window.localStorage);
    notify();
  }, []);

  const real = buildWelcomeSteps(
    isProfileDone(fitxaQ.data),
    (promosQ.data?.length ?? 0) > 0,
    poster,
  );
  const steps =
    forced === "new"
      ? buildWelcomeSteps(false, false, false)
      : forced === "partial"
        ? buildWelcomeSteps(true, false, false)
        : forced === "complete"
          ? buildWelcomeSteps(true, true, true)
          : real;
  const complete = steps.every((s) => s.done);

  // Closing hides it for this access; once complete it is gone for good.
  const dismiss = useCallback(() => {
    if (complete) window.localStorage.setItem(FINISHED_KEY, "1");
    else window.sessionStorage.setItem(DISMISSED_SESSION_KEY, "1");
    notify();
  }, [complete]);

  const reopen = useCallback(() => {
    window.sessionStorage.removeItem(DISMISSED_SESSION_KEY);
    notify();
  }, []);

  return {
    steps,
    loading: fitxaQ.isLoading || promosQ.isLoading,
    error: fitxaQ.isError || promosQ.isError,
    reload: () => {
      fitxaQ.refetch();
      promosQ.refetch();
    },
    markPosterDone,
    dismissed,
    finished: finished && (forced === null || forced === "complete"),
    dismiss,
    reopen,
  };
}
