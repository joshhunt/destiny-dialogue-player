import { useMemo, useState } from "react";

import AudioPlayer from "./lib/AudioPlayer";
import { AudioContextProvider } from "./lib/audioContext";

import MainView from "./views/MainView";

export default function App() {
  const [audioPlayer] = useState(() => new AudioPlayer());

  const contextValue = useMemo(
    () => ({
      audioPlayer,
    }),
    [audioPlayer]
  );

  return (
    <AudioContextProvider value={contextValue}>
      <MainView />
    </AudioContextProvider>
  );
}
