import { createContext, useContext, useMemo, useState } from "react";
import { AnyDialogueNode, DialogueBank, DialogueLine } from "../../types";
import uniq from "lodash/uniq";

interface SearchContext {
  narrators: string[];
  selectedNarrator: string | undefined;
  setSelectedNarrator: (narrator: string) => void;
}

const searchContext = createContext<SearchContext | undefined>(undefined);
export const SearchContextProvider = searchContext.Provider;

export function useSearchContext() {
  const value = useContext(searchContext);

  if (!value) {
    throw new Error("Search context not set");
  }

  return value;
}

function filterDialogue<TNode extends AnyDialogueNode>(
  node: TNode,
  filterFn: (line: DialogueLine) => boolean
): TNode | undefined {
  if (!("type" in node)) {
    const children = node.dialogues
      .map((child) => filterDialogue(child.dialogue, filterFn))
      .filter(Boolean);

    return children.length
      ? {
          ...node,
          options: children,
        }
      : undefined;
  }

  // const type = node.type;

  if (node.type === "DialogueBranch") {
    const children = node.options
      .map((child) => filterDialogue(child, filterFn))
      .filter(Boolean);

    return children.length
      ? {
          ...node,
          options: children,
        }
      : undefined;
  }

  if (node.type === "DialogueSequence") {
    const children = node.sequence
      .map((child) => filterDialogue(child, filterFn))
      .filter(Boolean);

    return children.length
      ? {
          ...node,
          sequence: children,
        }
      : undefined;
  }

  if (node.type === "DialogueLine") {
    const result = filterFn(node);
    return result ? node : undefined;
  }
}

function flatMapDialogue<ReturnValue>(
  node: AnyDialogueNode | DialogueBank[],
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

export default function useNarratorFilter(dialogueBanks: DialogueBank[]) {
  const [selectedNarrator, setSelectedNarrator] = useState<string>();

  const narrators = useMemo(() => {
    return uniq(
      flatMapDialogue(dialogueBanks, (line) =>
        line.narrator?.length < 20 ? line.narrator : null
      )
    );
  }, [dialogueBanks]);

  const filteredDialogue = useMemo(() => {
    if (!selectedNarrator) {
      return null;
    }

    const matchingBanks: DialogueBank[] = [];

    for (const dialogueBank of dialogueBanks) {
      const match = filterDialogue(
        dialogueBank,
        (line) => line.narrator === selectedNarrator
      );

      if (match) {
        matchingBanks.push(match);
      }
    }

    // const matchingLines = flatMapDialogue(dialogueBanks, (line) => {
    //   return line.narrator === selectedNarrator ? line : null;
    // });

    return matchingBanks.length ? matchingBanks : null;
  }, [dialogueBanks, selectedNarrator]);

  console.log(filteredDialogue);

  return { narrators, filteredDialogue, selectedNarrator, setSelectedNarrator };
}
