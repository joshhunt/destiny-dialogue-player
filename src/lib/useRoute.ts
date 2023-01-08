import { useEffect, useState } from "react";
import { Match, useRoute } from "wouter";
import isEqual from "lodash/isEqual";

type RouterParams = Match[1];

function useFixedRoute(route: string): Match {
  const [matches, instableParams] = useRoute(route);
  const [stableParams, setStableParams] = useState<RouterParams>(
    () => instableParams
  );

  useEffect(() => {
    setStableParams((oldParams) => {
      if (isEqual(oldParams, instableParams)) {
        return oldParams;
      } else {
        return instableParams;
      }
    });
  }, [instableParams]);

  if (matches && stableParams) {
    return [true, stableParams];
  }

  if (!matches && !stableParams) {
    return [false, null];
  }

  throw new Error("useFixedRoute invalid condition");
}

export function useDialogueRoute() {
  return useFixedRoute("/d/:tableHash/:treeHash?/:lineHash?");
}

export function useReleaseDialogueRoute() {
  return useFixedRoute("/release/:releaseName");
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
