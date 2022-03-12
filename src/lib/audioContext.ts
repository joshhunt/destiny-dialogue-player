import React, { useContext } from "react";
import AudioPlayer from "./AudioPlayer";

interface AudioContext {
  audioPlayer: AudioPlayer;
}

export const audioContext = React.createContext<AudioContext | null>(null);
export const AudioContextProvider = audioContext.Provider;

export const useAudioContext = () => {
  return useContext(audioContext);
};
