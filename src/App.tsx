import MainView from "./views/MainView";
import useDialogueBanks, { LoadingState } from "./lib/useDialogueBanks";
import { AudioContextProvider, useAudioState } from "./lib/audioContext";
import { DialogueBank, DialogueLine, CurrentDialogueState } from "./types";

export default function App() {
  const { audioContext, nowNextDialogue, playlist } = useAudioState();
  const { dialogueBanks, state } = useDialogueBanks();

  return (
    <AudioContextProvider value={audioContext}>
      <VisualLoadingState
        dialogueBanks={dialogueBanks}
        loadingState={state}
        nowNextDialogue={nowNextDialogue}
        playlist={playlist}
      />
    </AudioContextProvider>
  );
}

interface VisualLoadingStateProps {
  dialogueBanks: DialogueBank[];
  loadingState: LoadingState;
  nowNextDialogue: CurrentDialogueState | undefined;
  playlist: DialogueLine[];
}

const VisualLoadingState: React.FC<VisualLoadingStateProps> = ({
  dialogueBanks,
  loadingState,
  nowNextDialogue,
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
          nowNextDialogue={nowNextDialogue}
          playlist={playlist}
        />
      );
    }

    default:
      return <div>Unhandled state {loadingState}</div>;
  }
};
