import { get as idbGet, set as idbSet } from "idb-keyval";
import pLimit from "p-limit";
import { useEffect, useState } from "react";
import { DialogueBank, DialogueManifest } from "../types";

async function getManifest() {
  const resp = await fetch(
    "https://destiny-dialogue-project.s3.ap-southeast-2.amazonaws.com/manifest.json"
  );
  const data = await resp.json();

  return data as DialogueManifest;
}

async function getDialogueBank(fileName: string) {
  const idbKey = `dialogue-bank-${fileName}`;

  const cached = await idbGet<DialogueBank>(idbKey);

  if (cached) {
    return cached;
  }

  const resp = await fetch(
    `https://destiny-dialogue-project.s3.ap-southeast-2.amazonaws.com/dialogue-banks/${fileName}`
  );
  const data = await resp.json();
  await idbSet(idbKey, data);

  return data as DialogueBank;
}

async function getAllDialogueBanks() {
  const manifest = await getManifest();
  const limit = pLimit(10);

  const urlParams = new URLSearchParams(window.location.search.slice(1));
  const specificHash = Number(urlParams.get("hash"));

  const promises = manifest.dialogueBanks
    .filter((entry) => (specificHash > 0 ? entry.hash === specificHash : true))
    .map((entry) => limit(() => getDialogueBank(entry.fileName)));

  const data = await Promise.all(promises);
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
      .catch(() => {
        setState(LoadingState.Error);
      });
  }, []);

  return {
    dialogueBanks,
    state,
  };
}
