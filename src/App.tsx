import { MainViewLoadingStates } from "./views/MainView";
import useDialogueBanks from "./lib/useDialogueBanks";
import { AudioContextProvider, useAudioState } from "./lib/audioContext";
import useNarratorFilter, {
  SearchContextProvider,
} from "./views/MainView/useNarratorFilter";
import { useMemo } from "react";

export default function App() {
  const { audioContext, nowNextDialogue, playlist } = useAudioState();
  const { dialogueBanks, progress, state } = useDialogueBanks();

  const { narrators, selectedNarrator, filteredDialogue, setSelectedNarrator } =
    useNarratorFilter(dialogueBanks);

  const searchContextValue = useMemo(
    () => ({ narrators, selectedNarrator, setSelectedNarrator }),
    [narrators, selectedNarrator, setSelectedNarrator]
  );

  const dialogueToUse = filteredDialogue ?? dialogueBanks;

  return (
    <SearchContextProvider value={searchContextValue}>
      <AudioContextProvider value={audioContext}>
        <MainViewLoadingStates
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
