import MainView from ".";
import { LoadingProgress, LoadingState } from "../../lib/useDialogueBanks";
import { DialogueBank, CurrentDialogueState, DialogueLine } from "../../types";
import ErrorView from "../ErrorView";
import LoadingView from "../LoadingView";

interface MainViewLoadingStatesProps {
  dialogueBanks: DialogueBank[];
  error: any;
  progress: LoadingProgress | undefined;
  loadingState: LoadingState;
  nowNextDialogue: CurrentDialogueState;
  playlist: DialogueLine[];
}

const MainViewLoadingState: React.FC<MainViewLoadingStatesProps> = ({
  dialogueBanks,
  progress,
  error,
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
      return <ErrorView error={error} />;
    }

    default:
      return <div>Unhandled state {loadingState}</div>;
  }
};

export default MainViewLoadingState;
