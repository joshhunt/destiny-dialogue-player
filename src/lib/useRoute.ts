import { useRoute } from "wouter";

export function useDialogueRoute() {
  return useRoute("/d/:tableHash/:treeHash?/:lineHash?");
}

export function useReleaseDialogueRoute() {
  return useRoute("/release/:releaseName");
}
