import { useEffect, useState } from "react";

// Optional: invite code from `/register?ref=CODE`. Remove this hook and its single use
// in Registre to drop the "invited by a neighbour" line.
export function useInviteCode(): string | undefined {
  const [code, setCode] = useState<string | undefined>(undefined);
  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get("ref");
    setCode(ref && ref.trim() ? ref.trim() : undefined);
  }, []);
  return code;
}
