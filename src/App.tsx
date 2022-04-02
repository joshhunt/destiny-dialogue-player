import MainView from "./views/MainView";
import useDialogueBanks, { LoadingState } from "./lib/useDialogueBanks";
import { AudioContextProvider, useAudioState } from "./lib/audioContext";
import { DialogueBank, DialogueLine } from "./types";

export default function App() {
  const { audioContext, currentlyPlayingDialogue, playlist } = useAudioState();
  const { dialogueBanks, state } = useDialogueBanks();

  return (
    <AudioContextProvider value={audioContext}>
      <VisualLoadingState
        dialogueBanks={dialogueBanks}
        loadingState={state}
        currentlyPlayingDialogue={currentlyPlayingDialogue}
        playlist={playlist}
      />
    </AudioContextProvider>
  );
}

interface VisualLoadingStateProps {
  dialogueBanks: DialogueBank[];
  loadingState: LoadingState;
  currentlyPlayingDialogue: DialogueLine | undefined;
  playlist: DialogueLine[];
}

const VisualLoadingState: React.FC<VisualLoadingStateProps> = ({
  dialogueBanks,
  loadingState,
  currentlyPlayingDialogue,
  playlist,
}) => {
  switch (loadingState) {
    case LoadingState.NotStarted:
    case LoadingState.Loading: {
      return <div>Loading...</div>;
    }

    case LoadingState.Error: {
      return <div>Error</div>;
    }

    case LoadingState.Done: {
      return (
        <MainView
          dialogueBanks={dialogueBanks}
          currentlyPlayingDialogue={currentlyPlayingDialogue}
          playlist={playlist}
        />
      );
    }

    default:
      return <div>Unhandled state {loadingState}</div>;
  }
};
