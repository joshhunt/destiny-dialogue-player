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
  await idbSet(idbKey, data);

  return data as DialogueBank;
}

async function getAllDialogueBanks() {
  const manifest = await getManifest();
  const limit = pLimit(10);

  const urlParams = new URLSearchParams(window.location.search.slice(1));
  const specificHash = Number(urlParams.get("hash"));

  const latestIDBKeys = manifest.dialogueBanks.map((v) =>
    getIDBKey(v.fileName)
  );

  const promises = manifest.dialogueBanks
    .filter((entry) => (specificHash > 0 ? entry.hash === specificHash : true))
    .map((entry) => limit(() => getDialogueBank(entry.fileName)));

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

export default function useDialogueBanks() {
  const [state, setState] = useState(LoadingState.NotStarted);
  const [dialogueBanks, setDialogueBanks] = useState<DialogueBank[]>([]);

  useEffect(() => {
    getAllDialogueBanks()
      .then((allData) => {
        setDialogueBanks(allData);
        setState(LoadingState.Done);
      })
      .catch((err) => {
        console.error(err);
        setState(LoadingState.Error);
      });
  }, []);

  return {
    dialogueBanks,
    state,
  };
}
