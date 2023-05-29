import { MainViewLoadingStates } from "../../views/MainView";
import useDialogueBanks from "../../lib/useDialogueBanks";
import { AudioContextProvider, useAudioState } from "../../lib/audioContext";
import useNarratorFilter from "../MainView/useNarratorFilter";
import useTextSearch from "../../lib/useTextSearch";
import { SearchContextProvider } from "../MainView/searchContext";
import { useCallback, useMemo, useState } from "react";
import { Gender } from "../../types";
import { type Edition, editions } from "../../lib/versionMap";

interface EditionValidatorProps {
  params: {
    edition: string;
  };
}

interface EditionDialogueProps {
  edition: Edition;
}

export default function EditionValidator({
  params: { edition },
}: EditionValidatorProps) {
  const editionData = useMemo(
    () => editions.find((v) => v.id === edition),
    [edition]
  );

  return editionData ? (
    <EditionDialogue edition={editionData} />
  ) : (
    <div>404 edition not found</div>
  );
}

function EditionDialogue({ edition }: EditionDialogueProps) {
  const [gender, setGenderState] = useState<Gender>(() => {
    return (window.localStorage.getItem("dialogueGender") ??
      "Masculine") as Gender;
  });
  const { audioContext, nowNextDialogue, playlist } = useAudioState();
  const { dialogueBanks, progress, state, error } = useDialogueBanks(edition);

  const { searchResultsDialogue, searchText, setSearchText } =
    useTextSearch(dialogueBanks);

  const setGender = useCallback((gender: Gender) => {
    window.localStorage.setItem("dialogueGender", gender);
    setGenderState(gender);
  }, []);

  const {
    narrators,
    selectedNarrator,
    narratorFilteredDialogue,
    setSelectedNarrator,
  } = useNarratorFilter(searchResultsDialogue);

  const searchContextValue = useMemo(
    () => ({
      narrators,
      selectedNarrator,
      setSelectedNarrator,
      searchText,
      setSearchText,
      gender,
      setGender,
    }),
    [
      narrators,
      selectedNarrator,
      setSelectedNarrator,
      searchText,
      setSearchText,
      gender,
      setGender,
    ]
  );

  const dialogueToUse = narratorFilteredDialogue;

  return (
    <SearchContextProvider value={searchContextValue}>
      <AudioContextProvider value={audioContext}>
        <MainViewLoadingStates
          error={error}
          dialogueBanks={dialogueToUse}
          progress={progress}
          loadingState={state}
          nowNextDialogue={nowNextDialogue}
          playlist={playlist}
        />
      </AudioContextProvider>
    </SearchContextProvider>
  );
}
