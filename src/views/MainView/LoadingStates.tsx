import { useCallback, useState } from "react";
import MainView from ".";
import { RootDialogueCollection } from "../../components/VirtualDialogueTree/types";
import { LoadingProgress, LoadingState } from "../../lib/useDialogueBanks";
import { CurrentDialogueState, DialogueLine } from "../../types";
import DisclaimerView from "../DisclaimerView";
import ErrorView from "../ErrorView";
import LoadingView from "../LoadingView";

interface MainViewLoadingStatesProps {
  dialogueBanks: RootDialogueCollection;
  error: any;
  progress: LoadingProgress | undefined;
  loadingState: LoadingState;
  nowNextDialogue: CurrentDialogueState;
  playlist: DialogueLine[];
}

const DISCLAIMER_APPROVAL_KEY = "disclaimer-approval";
const DISCLAIMER_APPROVAL_VALUE = "agree-3";

const MainViewLoadingState: React.FC<MainViewLoadingStatesProps> = ({
  dialogueBanks,
  progress,
  error,
  loadingState,
  nowNextDialogue,
  playlist,
}) => {
  const [agreed, setAgreed] = useState(() =>
    localStorage.getItem(DISCLAIMER_APPROVAL_KEY)
  );

  const handleDisclaimerApprove = useCallback(() => {
    setAgreed(DISCLAIMER_APPROVAL_VALUE);
    localStorage.setItem(DISCLAIMER_APPROVAL_KEY, DISCLAIMER_APPROVAL_VALUE);
  }, []);

  if (agreed !== DISCLAIMER_APPROVAL_VALUE) {
    return <DisclaimerView onApprove={handleDisclaimerApprove} />;
  }

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
