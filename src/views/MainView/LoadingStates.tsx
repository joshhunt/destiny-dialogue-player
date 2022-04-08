import MainView from ".";
import { LoadingProgress, LoadingState } from "../../lib/useDialogueBanks";
import { DialogueBank, CurrentDialogueState, DialogueLine } from "../../types";
import LoadingView from "../LoadingView";

interface MainViewLoadingStatesProps {
  dialogueBanks: DialogueBank[];
  progress: LoadingProgress | undefined;
  loadingState: LoadingState;
  nowNextDialogue: CurrentDialogueState;
  playlist: DialogueLine[];
}

const MainViewLoadingState: React.FC<MainViewLoadingStatesProps> = ({
  dialogueBanks,
  progress,
  loadingState,
  nowNextDialogue,
  playlist,
}) => {
  switch (loadingState) {
    case LoadingState.Loading:
    case LoadingState.NotStarted: {
      return <LoadingView progress={progress} />;
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

    case LoadingState.Error: {
      return <div>Error</div>;
    }

    default:
      return <div>Unhandled state {loadingState}</div>;
  }
};

export default MainViewLoadingState;
