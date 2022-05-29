import { delMany, get as idbGet, keys, set as idbSet } from "idb-keyval";
import { orderBy } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { DialogueManifest, DialogueTable } from "../types";
import { getDialogueBankURL, getManifestURL } from "./dialogueAPI";
import httpGetProgress from "./fetchProgress";
import { useDialogueRoute } from "./useRoute";

function getVersionNumberFromPath(contentPath?: string) {
  if (!contentPath) {
    return Number.MAX_SAFE_INTEGER;
  }

  const matches = Array.from(contentPath.matchAll(/(d|v)(\d+)\\/g) ?? []);
  const lastMatch = matches.at(-1);

  if (!lastMatch) {
    return Number.MAX_SAFE_INTEGER;
  }

  return parseInt(lastMatch[2]);
}

async function getManifest() {
  const resp = await fetch(getManifestURL());
  const data = await resp.json();

  return data as DialogueManifest;
}

async function getAllDialogueBanks(
  dispatchProgress: (p: LoadingProgress) => void
): Promise<DialogueTable[]> {
  const manifest = await getManifest();
  const cached = await idbGet<DialogueTable[]>(manifest.dialoguePath);

  if (cached) {
    return cached;
  }

  const data = (await httpGetProgress(
    getDialogueBankURL(manifest.dialoguePath),
    (total, progress) => dispatchProgress({ total, progress })
  )) as DialogueTable[];
  await idbSet(manifest.dialoguePath, data);

  dispatchProgress({
    progress: 90,
    total: 100,
  });

  const allKeysInIDB = await keys<string>();

  dispatchProgress({
    progress: 95,
    total: 100,
  });

  const keysToDelete = allKeysInIDB.filter(
    (key) => key !== manifest.dialoguePath
  );
  await delMany(keysToDelete);

  dispatchProgress({
    progress: 99,
    total: 100,
  });

  return orderBy(
    data.map((bank) => {
      return {
        ...bank,
        contentPath: bank.contentPath
          ?.replace(/^content\\dialog\\/, "")
          .replace(/\.dialog_table\.tft$/, ""),
      };
    }),
    (v) => getVersionNumberFromPath(v.contentPath)
  );
}

export enum LoadingState {
  NotStarted,
  Loading,
  Done,
  Error,
}

export interface LoadingProgress {
  progress: number;
  total: number;
}

export default function useDialogueBanks() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [match, params] = useDialogueRoute();

  const [state, setState] = useState(LoadingState.NotStarted);
  const [error, setError] = useState<any>();
  const [progress, setProgress] = useState<LoadingProgress>();
  const [dialogueBanks, setDialogueBanks] = useState<DialogueTable[]>([]);

  useEffect(() => {
    getAllDialogueBanks(setProgress)
      .then((allData) => {
        setDialogueBanks(allData);
        setState(LoadingState.Done);
      })
      .catch((err) => {
        console.error(err);
        setError(err);
        setState(LoadingState.Error);
      });
  }, []);

  const routeDialogue = useMemo(() => {
    const tableHash = parseInt(params?.tableHash ?? "0");
    if (tableHash === 0) {
      return dialogueBanks;
    }

    return dialogueBanks.filter((v) => v.hash === tableHash);
  }, [dialogueBanks, params?.tableHash]);

  return {
    progress,
    dialogueBanks: routeDialogue,
    state,
    error,
  };
}
