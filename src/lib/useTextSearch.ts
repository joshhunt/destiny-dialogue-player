import { Document as DocumentSearch } from "flexsearch";
import { keyBy } from "lodash";
import uniq from "lodash/uniq";
import { useEffect, useRef, useState } from "react";
import { DialogueBank, DialogueLine, FilteredDialogueBank } from "../types";
import { flatMapDialogue } from "../views/MainView/useNarratorFilter";

export default function useTextSearch(dialogueBanks: DialogueBank[]) {
  const [searchText, setSearchText] = useState<string>();
  const [searchResults, setSearchResults] = useState<FilteredDialogueBank[]>();

  const lastId = useRef(0);
  const idMap = useRef(new Map<string | number, number>());
  const flexsearchRef = useRef<DocumentSearch<DialogueLine | DialogueBank>>();

  useEffect(() => {
    async function main() {
      const flatLines = flatMapDialogue(dialogueBanks, (line) => {
        let id = idMap.current.get(line.id);

        if (id === undefined) {
          id = lastId.current;
          lastId.current += 1;
          idMap.current.set(line.id, id);
        }

        return { ...line, id };
      });

      flexsearchRef.current = new DocumentSearch({
        preset: "performance",
        tokenize: "forward",
        worker: true,
        matcher: {
          û: "u",
        },
        document: {
          id: "id",
          index: ["caption", "narrator", "contentPath"],
        },
      });

      const flexsearch = flexsearchRef.current;

      for (const dialogueLine of flatLines) {
        flexsearch.add(dialogueLine);
      }

      for (const bank of dialogueBanks) {
        flexsearch.add(bank);
      }
    }

    main();
  }, [dialogueBanks]);

  useEffect(() => {
    async function run() {
      const flexsearch = flexsearchRef.current;

      if (!searchText || searchText.length < 1) {
        setSearchResults(undefined);
        return;
      }

      if (!flexsearch) return;

      const rawResults = await flexsearch.searchAsync(searchText);
      const resultsByField = keyBy(rawResults, "field");
      console.log(resultsByField);

      const {
        caption: captionResults,
        narrator: narratorResults,
        contentPath: contentPathResults,
      } = resultsByField;

      let dialogueLineResults = [captionResults, narratorResults].flatMap(
        (v) => v?.result ?? []
      );

      const contentBankResults = contentPathResults?.result ?? [];

      dialogueLineResults = uniq(dialogueLineResults);

      const results: FilteredDialogueBank[] = [];

      for (const dialogueBank of dialogueBanks) {
        if (contentBankResults.includes(dialogueBank.id)) {
          results.push({
            ...dialogueBank,
            type: "FilteredDialogueBank",
            lines: dialogueBank.dialogues,
          });

          continue;
        }

        const match = flatMapDialogue(dialogueBank, (line) => {
          const id = idMap.current.get(line.id) ?? line.id;
          return dialogueLineResults.includes(id) ? line : undefined;
        });

        if (match?.length) {
          results.push({
            ...dialogueBank,
            type: "FilteredDialogueBank",
            lines: match,
          });
        }
      }

      setSearchResults(results);
    }

    run();
  }, [dialogueBanks, searchText]);

  return {
    searchResultsDialogue: searchResults ?? dialogueBanks,
    searchText,
    setSearchText,
  };
}
