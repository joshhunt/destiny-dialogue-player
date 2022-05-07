import { MainViewLoadingStates } from "./views/MainView";
import useDialogueBanks from "./lib/useDialogueBanks";
import { AudioContextProvider, useAudioState } from "./lib/audioContext";
import useNarratorFilter from "./views/MainView/useNarratorFilter";
import useTextSearch from "./lib/useTextSearch";
import { SearchContextProvider } from "./views/MainView/searchContext";
import { useMemo } from "react";

export default function App() {
  const { audioContext, nowNextDialogue, playlist } = useAudioState();
  const { dialogueBanks, progress, state, error } = useDialogueBanks();
  const { searchResultsDialogue, searchText, setSearchText } =
    useTextSearch(dialogueBanks);

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
    }),
    [
      narrators,
      selectedNarrator,
      setSelectedNarrator,
      searchText,
      setSearchText,
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
        <div className="scrollbarFillerHack" />
      </AudioContextProvider>
    </SearchContextProvider>
  );
}
