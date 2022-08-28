import { useEffect, useState } from "react";
import { useRoute } from "wouter";

export function useDialogueRoute() {
  return useRoute("/d/:tableHash/:treeHash?/:lineHash?");
}

export function useReleaseDialogueRoute() {
  return useRoute("/release/:releaseName");
}

export function useQueryParams() {
  function getQueryParams() {
    return Object.fromEntries(
      new URLSearchParams(window.location.search).entries()
    );
  }

  const [bootQueryParams, setBootQueryParams] = useState<
    Record<string, string | undefined>
  >(() => getQueryParams());

  useEffect(() => {
    setBootQueryParams(getQueryParams());
  }, []);

  return bootQueryParams;
}

export function useDialogueBankURLOverride() {
  const { dialogueBankURLOverride } = useQueryParams();
  return dialogueBankURLOverride;
}
