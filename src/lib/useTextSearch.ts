import { Document as DocumentSearch } from "flexsearch";
import uniq from "lodash/uniq";
import { useEffect, useMemo, useRef, useState } from "react";
import { DialogueBank, DialogueLine, FilteredDialogueBank } from "../types";
import { flatMapDialogue } from "../views/MainView/useNarratorFilter";

export default function useTextSearch(dialogueBanks: DialogueBank[]) {
  const [searchText, setSearchText] = useState<string>();

  const [searchResults, setSearchResults] = useState<FilteredDialogueBank[]>();

  const lastId = useRef(0);
  const idMap = useRef(new Map<string | number, number>());
  const flexsearchRef = useRef<DocumentSearch<DialogueLine>>();

  const flatLines = useMemo(() => {
    return flatMapDialogue(dialogueBanks, (line) => {
      let id = idMap.current.get(line.id);

      if (id === undefined) {
        id = lastId.current;
        lastId.current += 1;
        idMap.current.set(line.id, id);
      }

      return { ...line, id };
    });
  }, [dialogueBanks]);

  useEffect(() => {
    async function main() {
      flexsearchRef.current = new DocumentSearch({
        preset: "performance",
        tokenize: "forward",
        worker: true,
        matcher: {
          û: "u",
        },
        document: {
          id: "id",
          index: ["caption", "narrator"],
        },
      });

      const flexsearch = flexsearchRef.current;

      for (const dialogueLine of flatLines) {
        flexsearch.add(dialogueLine);
      }

      /// @ts-ignore
      window.__search = flexsearch;
    }

    main();
  }, [flatLines]);

  useEffect(() => {
    async function run() {
      const flexsearch = flexsearchRef.current;

      if (!searchText || searchText.length < 1) {
        setSearchResults(undefined);
        return;
      }

      if (!flexsearch) return;

      const rawResults = await flexsearch.searchAsync(searchText);
      const rawCombinedResults = uniq(rawResults.flatMap((v) => v.result));

      const results: FilteredDialogueBank[] = [];

      for (const dialogueBank of dialogueBanks) {
        const match = flatMapDialogue(dialogueBank, (line) => {
          const id = idMap.current.get(line.id) ?? line.id;
          return rawCombinedResults.includes(id) ? line : undefined;
        });

        if (match?.length) {
          results.push({
            ...dialogueBank,
            type: "FilteredDialogueBank",
            lines: match,
          });
        }
      }

      if (results.length) {
        setSearchResults(results);
      } else {
        setSearchResults(undefined);
      }
    }

    run();
  }, [dialogueBanks, searchText]);

  return {
    searchResults,
    searchText,
    setSearchText,
  };
}
