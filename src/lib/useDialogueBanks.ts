import { delMany, get as idbGet, keys, set as idbSet } from "idb-keyval";
import pLimit from "p-limit";
import { useEffect, useState } from "react";
import { DialogueBank, DialogueManifest } from "../types";
import { getDialogueBankURL, getManifestURL } from "./dialogueAPI";

async function getManifest() {
  const resp = await fetch(getManifestURL());
  const data = await resp.json();

  return data as DialogueManifest;
}

function getIDBKey(fileName: string) {
  return `dialogue-bank-${fileName}`;
}

async function getDialogueBank(fileName: string) {
  const idbKey = getIDBKey(fileName);
  const cached = await idbGet<DialogueBank>(idbKey);

  if (cached) {
    return cached;
  }

  const resp = await fetch(getDialogueBankURL(fileName));
  const data = await resp.json();
  // await idbSet(idbKey, data);

  return data as DialogueBank;
}

async function getAllDialogueBanks(
  dispatchProgress: (p: LoadingProgress) => void
) {
  const manifest = await getManifest();
  const limit = pLimit(10);

  const urlParams = new URLSearchParams(window.location.search.slice(1));
  const specificHash = Number(urlParams.get("hash"));

  const latestIDBKeys = manifest.dialogueBanks.map((v) =>
    getIDBKey(v.fileName)
  );

  const banksToLoad = manifest.dialogueBanks
    .filter((entry) => (specificHash > 0 ? entry.hash === specificHash : true))
    .slice(0, 3000);

  let loaded = 0;
  dispatchProgress({
    progress: loaded,
    total: banksToLoad.length,
  });

  const promises = banksToLoad.map((entry) =>
    limit(async () => {
      const bank = await getDialogueBank(entry.fileName);
      loaded += 1;
      dispatchProgress({
        progress: loaded,
        total: banksToLoad.length,
      });
      return bank;
    })
  );

  const data = await Promise.all(promises);

  const allKeysInIDB = await keys<string>();
  const keysToDelete = allKeysInIDB.filter(
    (key) => !latestIDBKeys.includes(key)
  );
  await delMany(keysToDelete);

  return data;
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
  const [state, setState] = useState(LoadingState.NotStarted);
  const [error, setError] = useState<any>();
  const [progress, setProgress] = useState<LoadingProgress>();
  const [dialogueBanks, setDialogueBanks] = useState<DialogueBank[]>([]);

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

  return {
    progress,
    dialogueBanks,
    state,
    error,
  };
}
