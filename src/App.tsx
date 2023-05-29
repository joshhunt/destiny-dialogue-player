import { MainViewLoadingStates } from "./views/MainView";
import useDialogueBanks from "./lib/useDialogueBanks";
import { AudioContextProvider, useAudioState } from "./lib/audioContext";
import useNarratorFilter from "./views/MainView/useNarratorFilter";
import useTextSearch from "./lib/useTextSearch";
import { SearchContextProvider } from "./views/MainView/searchContext";
import { useCallback, useMemo, useState } from "react";
import { Gender } from "./types";

export default function App() {
  const [gender, setGenderState] = useState<Gender>(() => {
    return (window.localStorage.getItem("dialogueGender") ??
      "Masculine") as Gender;
  });
  const { audioContext, nowNextDialogue, playlist } = useAudioState();
  const { dialogueBanks, progress, state, error } = useDialogueBanks();

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
