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

    const matchingLines = flatMapDialogue(dialogueBanks, (line) => {
      return line.narrator === selectedNarrator ? line : null;
    });

    return matchingLines.length
      ? {
          type: "SearchResults" as const,
          id: "$$searchResults",
          results: matchingLines,
        }
      : null;
  }, [dialogueBanks, selectedNarrator]);

  return { narrators, filteredDialogue, selectedNarrator, setSelectedNarrator };
}
