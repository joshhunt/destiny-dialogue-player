import { useMemo, useState } from "react";
import {
  AnyDialogueStructure,
  DialogueLine,
  DialogueTree,
  FilteredDialogueTable,
} from "../../types";
import uniq from "lodash/uniq";
import { RootDialogueCollection } from "../../components/VirtualDialogueTree/types";

export function flatMapDialogue<ReturnValue>(
  node: AnyDialogueStructure | RootDialogueCollection | DialogueTree,
  mapFn: (dialogueLine: DialogueLine) => ReturnValue
): Exclude<ReturnValue, null | undefined>[] {
  if (Array.isArray(node)) {
    return node.flatMap((child) => flatMapDialogue(child, mapFn));
  }

  const type = node.type;

  if (node.type === "ArchivedDialogueTable") {
    return node.dialogues.flatMap((tree) =>
      flatMapDialogue(tree.dialogue, mapFn)
    );
  }

  if (node.type === "FilteredDialogueTable") {
    return node.lines.flatMap((child) => flatMapDialogue(child, mapFn));
  }

  if (node.type === "ArchivedDialogueTree") {
    return flatMapDialogue(node.dialogue, mapFn);
  }

  if (node.type === "DialogueBranch") {
    return node.options.flatMap((child) => flatMapDialogue(child, mapFn));
  }

  if (node.type === "DialogueSequence") {
    return node.sequence.flatMap((child) => flatMapDialogue(child, mapFn));
  }

  if (node.type === "DialogueLine") {
    const returnValue = mapFn(node);

    if (returnValue === null || returnValue === undefined) {
      return [];
    } else {
      return [returnValue as any]; //  TODO
    }
  }

  throw new Error("unhandled type " + type);
}

function fixNarrator(narrator: string | undefined) {
  return narrator?.trim() ?? "";
}

export default function useNarratorFilter(
  dialogueBanks: RootDialogueCollection
) {
  const [selectedNarrator, setSelectedNarrator] = useState<string>();

  const narrators = useMemo(() => {
    return uniq(
      flatMapDialogue(dialogueBanks, (line) =>
        line.narrator?.length < 20 ? fixNarrator(line.narrator) : null
      )
    );
  }, [dialogueBanks]);

  const filteredDialogue = useMemo(() => {
    if (selectedNarrator === undefined) {
      return null;
    }

    const matchingBanks: FilteredDialogueTable[] = [];

    for (const dialogueBank of dialogueBanks) {
      const match = flatMapDialogue(dialogueBank, (line) =>
        fixNarrator(line.narrator) === selectedNarrator ? line : undefined
      );

      if (match?.length) {
        matchingBanks.push({
          ...dialogueBank,
          type: "FilteredDialogueTable",
          lines: match,
        });
      }
    }

    return matchingBanks;
  }, [dialogueBanks, selectedNarrator]);

  return {
    narrators,
    narratorFilteredDialogue: filteredDialogue ?? dialogueBanks,
    selectedNarrator,
    setSelectedNarrator,
  };
}
