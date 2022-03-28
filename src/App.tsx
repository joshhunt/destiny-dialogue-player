import { useMemo, useState } from "react";

import AudioPlayer from "./lib/AudioPlayer";
import { AudioContextProvider } from "./lib/audioContext";

import MainView from "./views/MainView";
import useDialogueBanks, { LoadingState } from "./lib/useDialogueBanks";
import { DialogueBank } from "./types";

export default function App() {
  const [audioPlayer] = useState(() => new AudioPlayer());
  const { dialogueBanks, state } = useDialogueBanks();

  console.log("dialogueBanks", dialogueBanks);

  const contextValue = useMemo(
    () => ({
      audioPlayer,
    }),
    [audioPlayer]
  );

  return (
    <AudioContextProvider value={contextValue}>
      <VisualLoadingState dialogueBanks={dialogueBanks} loadingState={state} />
    </AudioContextProvider>
  );
}

interface VisualLoadingStateProps {
  dialogueBanks: DialogueBank[];
  loadingState: LoadingState;
}

const VisualLoadingState: React.FC<VisualLoadingStateProps> = ({
  dialogueBanks,
  loadingState,
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
      return <MainView dialogueBanks={dialogueBanks} />;
    }

    default:
      return <div>Unhandled state {loadingState}</div>;
  }
};
