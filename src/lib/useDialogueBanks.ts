import { delMany, get as idbGet, keys, set as idbSet } from "idb-keyval";
import { orderBy } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { DialogueManifest, DialogueTable } from "../types";
import { getDialogueBankURL, getManifestURL } from "./dialogueAPI";
import httpGetProgress from "./fetchProgress";
import {
  useDialogueBankURLOverride,
  useDialogueRoute,
  useQueryParams,
  useReleaseDialogueRoute,
} from "./useRoute";
import { versions } from "./versionMap";

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
  dispatchProgress: (p: LoadingProgress) => void,
  dialogueBankURLOverride?: string | undefined
): Promise<DialogueTable[]> {
  let dialoguePath: string;

  if (dialogueBankURLOverride) {
    dialoguePath = dialogueBankURLOverride;
  } else {
    const manifest = await getManifest();
    dialoguePath = manifest.dialoguePath;
  }

  const cached = await idbGet<DialogueTable[]>(dialoguePath);

  if (cached) {
    return cached;
  }

  const data = (await httpGetProgress(
    getDialogueBankURL(dialoguePath),
    (total, progress) => dispatchProgress({ total, progress })
  )) as DialogueTable[];
  await idbSet(dialoguePath, data);

  dispatchProgress({
    progress: 90,
    total: 100,
  });

  const allKeysInIDB = await keys<string>();

  dispatchProgress({
    progress: 95,
    total: 100,
  });

  // Don't clear keys if we're visiting an override
  if (!dialogueBankURLOverride) {
    const keysToDelete = allKeysInIDB.filter((key) => key !== dialoguePath);
    await delMany(keysToDelete);
  }

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
  const [matchesDialogueRoute, dialougeParams] = useDialogueRoute();
  const [matchesReleaseRoute, releaseParams] = useReleaseDialogueRoute();
  useQueryParams();
  const dialogueBankURLOverride = useDialogueBankURLOverride();

  const [state, setState] = useState(LoadingState.NotStarted);
  const [error, setError] = useState<any>();
  const [progress, setProgress] = useState<LoadingProgress>();
  const [dialogueBanks, setDialogueBanks] = useState<DialogueTable[]>([]);

  useEffect(() => {
    console.log("dialougeParams useEffect");
  }, [dialougeParams]);

  useEffect(() => {
    console.log("releaseParams useEffect");
  }, [releaseParams]);

  useEffect(() => {
    getAllDialogueBanks(setProgress, dialogueBankURLOverride)
      .then((allData) => {
        setDialogueBanks(allData);
        setState(LoadingState.Done);
      })
      .catch((err) => {
        console.error(err);
        setError(err);
        setState(LoadingState.Error);
      });
  }, [dialogueBankURLOverride]);

  const routeDialogue = useMemo(() => {
    console.log("route dialogue useMemo triggered");
    if (matchesDialogueRoute && dialougeParams?.tableHash) {
      const tableHash = parseInt(dialougeParams.tableHash);
      const treeHash = parseInt(dialougeParams.treeHash ?? "0");

      const table = dialogueBanks.filter((v) => v.hash === tableHash);

      if (treeHash === 0 || table.length === 0) {
        return table;
      }

      const firstTable = table[0];
      const specificTree = firstTable.dialogues.filter(
        (v) => v.hash === treeHash
      );

      return [
        {
          ...firstTable,
          dialogues: specificTree,
        },
      ];
    } else if (matchesReleaseRoute && releaseParams) {
      const version = Object.values(versions).find(
        (v) => v.routeName === releaseParams.releaseName
      );

      if (!version) return dialogueBanks;

      const filtered = dialogueBanks
        .map((bank) => {
          const dialogueTreesForVersion = bank.dialogues.filter(
            (tree) => tree.versions[0] === version.version
          );
          return {
            ...bank,
            dialogues: dialogueTreesForVersion,
          };
        })
        .filter((v) => v.dialogues.length);

      return filtered;
    } else {
      return dialogueBanks;
    }
  }, [
    matchesDialogueRoute,
    dialougeParams,
    matchesReleaseRoute,
    releaseParams,
    dialogueBanks,
  ]);

  return {
    progress,
    dialogueBanks: routeDialogue,
    state,
    error,
  };
}
