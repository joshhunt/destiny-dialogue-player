import { MainViewLoadingStates } from "./views/MainView";
import useDialogueBanks from "./lib/useDialogueBanks";
import { AudioContextProvider, useAudioState } from "./lib/audioContext";
import useNarratorFilter from "./views/MainView/useNarratorFilter";
import { useMemo } from "react";
import useTextSearch from "./lib/useTextSearch";
import { SearchContextProvider } from "./views/MainView/searchContext";

export default function App() {
  const { audioContext, nowNextDialogue, playlist } = useAudioState();
  const { dialogueBanks, progress, state, error } = useDialogueBanks();
  const { searchResults, searchText, setSearchText } =
    useTextSearch(dialogueBanks);

  const {
    narrators,
    selectedNarrator,
    filteredDialogue: narratorFiltered,
    setSelectedNarrator,
  } = useNarratorFilter(searchResults ?? dialogueBanks);

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

  const dialogueToUse = narratorFiltered ?? searchResults ?? dialogueBanks;

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
