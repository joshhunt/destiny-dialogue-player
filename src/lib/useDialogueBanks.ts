import { delMany, get as idbGet, keys, set as idbSet } from "idb-keyval";
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
import { versions, editions, Edition } from "./versionMap";

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

async function getManifest(manifestName: string) {
  const resp = await fetch(getManifestURL(manifestName));
  const data = await resp.json();

  return data as DialogueManifest;
}

async function getDialogueEdition(
  dispatchProgress: (p: LoadingProgress) => void,
  manifestName: string
) {
  const manifest = await getManifest(manifestName);
  const cached = await idbGet<DialogueTable[]>(manifest.dialoguePath);

  if (cached) {
    return [manifest.dialoguePath, cached] as const;
  }

  let data = (await httpGetProgress(
    getDialogueBankURL(manifest.dialoguePath),
    (total, progress) => dispatchProgress({ total, progress })
  )) as DialogueTable[];

  data = data.map((bank) => {
    return {
      ...bank,
      contentPath: bank.contentPath
        ?.replace(/^content\\dialog\\/, "")
        .replace(/\.dialog_table\.tft$/, ""),
    };
  });

  await idbSet(manifest.dialoguePath, data);

  return [manifest.dialoguePath, data] as const;
}

async function getAllDialogueBanks(
  dispatchProgress: (p: LoadingProgress) => void,
  edition: Edition
): Promise<DialogueTable[]> {
  const [dialoguePath, dialogueTables] = await getDialogueEdition(
    dispatchProgress,
    edition.manifestName
  );

  dispatchProgress({
    progress: 90,
    total: 100,
  });

  const allKeysInIDB = await keys<string>();

  dispatchProgress({
    progress: 95,
    total: 100,
  });

  const keysToDelete = allKeysInIDB.filter((key) => key !== dialoguePath);
  await delMany(keysToDelete);

  dispatchProgress({
    progress: 99,
    total: 100,
  });

  return dialogueTables;
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

export default function useDialogueBanks(edition: Edition) {
  const [matchesDialogueRoute, dialougeParams] = useDialogueRoute();

  const [matchesReleaseRoute, releaseParams] = useReleaseDialogueRoute();
  useQueryParams();

  const [state, setState] = useState(LoadingState.NotStarted);
  const [error, setError] = useState<any>();
  const [progress, setProgress] = useState<LoadingProgress>();
  const [dialogueBanks, setDialogueBanks] = useState<DialogueTable[]>([]);

  useEffect(() => {
    getAllDialogueBanks(setProgress, edition)
      .then((allData) => {
        setDialogueBanks(allData);
        setState(LoadingState.Done);
      })
      .catch((err) => {
        console.error(err);
        setError(err);
        setState(LoadingState.Error);
      });
  }, [edition]);

  const routeDialogue = useMemo(() => {
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
