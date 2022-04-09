import { useMemo, useState } from "react";
import {
  AnyDialogueNode,
  DialogueLine,
  FilteredDialogueBank,
} from "../../types";
import uniq from "lodash/uniq";
import { RootDialogueCollection } from "../../components/VirtualDialogueTree/types";

export function flatMapDialogue<ReturnValue>(
  node: AnyDialogueNode | RootDialogueCollection,
  mapFn: (dialogueLine: DialogueLine) => ReturnValue
): Exclude<ReturnValue, null | undefined>[] {
  if (Array.isArray(node)) {
    return node.flatMap((child) => flatMapDialogue(child, mapFn));
  }

  if (!("type" in node)) {
    return node.dialogues.flatMap((tree) =>
      flatMapDialogue(tree.dialogue, mapFn)
    );
  }

  const type = node.type;
  if (node.type === "DialogueBranch") {
    return node.options.flatMap((child) => flatMapDialogue(child, mapFn));
  }

  if (node.type === "FilteredDialogueBank") {
    return node.lines.flatMap((child) => flatMapDialogue(child, mapFn));
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

    const matchingBanks: FilteredDialogueBank[] = [];

    for (const dialogueBank of dialogueBanks) {
      const match = flatMapDialogue(dialogueBank, (line) =>
        fixNarrator(line.narrator) === selectedNarrator ? line : undefined
      );

      if (match?.length) {
        matchingBanks.push({
          ...dialogueBank,
          type: "FilteredDialogueBank",
          lines: match,
        });
      }
    }

    return matchingBanks.length ? matchingBanks : null;
  }, [dialogueBanks, selectedNarrator]);

  return { narrators, filteredDialogue, selectedNarrator, setSelectedNarrator };
}
