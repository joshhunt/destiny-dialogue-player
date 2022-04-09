import { Howl } from "howler";
import sample from "lodash/sample";
import React, {
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  DialogueLine,
  DialogueNode,
  DialogueTree,
  CurrentDialogueState,
} from "../types";
import { getMP3URL } from "./dialogueAPI";

interface AudioContext {
  playAudioNode: (
    node: DialogueNode,
    options?: PlayAudioOptions
  ) => Promise<void>;
  stopPlayback: () => void;
}

interface PlayAudioOptions {
  playAllBranches?: boolean;
}

export const audioContext = React.createContext<AudioContext | null>(null);
export const AudioContextProvider = audioContext.Provider;

const wait = (timeout: number) =>
  new Promise((resolve) => setTimeout(resolve, timeout));

export const useAudioContext = () => {
  const value = useContext(audioContext);

  if (!value) {
    throw new Error("Audio Player not provided");
  }

  return value;
};

function getDialoguePlaylist(
  node: DialogueNode | DialogueTree,
  playAllBranches?: boolean
): DialogueLine[] {
  if (node.type === "DialogueLine") {
    return [node];
  } else if (node.type === "DialogueSequence") {
    return node.sequence.flatMap((v) => getDialoguePlaylist(v));
  } else if (node.type === "DialogueBranch") {
    if (playAllBranches) {
      return node.options.flatMap((v) =>
        getDialoguePlaylist(v, playAllBranches)
      );
    }

    const randomChild = sample(node.options);

    if (!randomChild) {
      throw new Error(
        "Did not get a random child from DialogueBranch for some reason"
      );
    }
    return getDialoguePlaylist(randomChild);
  } else if (node.type === "DialogueTree") {
    return getDialoguePlaylist(node.dialogue);
  }

  throw new Error("shouldn't be here!");
}

interface Sound {
  sound: Howl;
  line: DialogueLine;
}

function getNextSound(currentSound: Sound, soundsPlaylist: Sound[]) {
  const currentIndex = soundsPlaylist.findIndex((v) => v === currentSound);
  return soundsPlaylist[currentIndex + 1];
}

export const useAudioState = () => {
  const [playlistState, setPlaylist] = useState<DialogueLine[]>([]);
  const soundsPlaylistRef = useRef<Sound[]>();
  const currentSoundRef = useRef<Sound>();
  // const playingStateRef = useRef<PlayingState>(PlayingState.NotStarted);

  const [nowNextDialogue, setNowNextDialogue] = useState<CurrentDialogueState>(
    {}
  );

  const stopPlayback = useCallback(() => {
    if (currentSoundRef.current) {
      currentSoundRef.current.sound.stop();
      // setPlaylist([]);
      setNowNextDialogue({});
      soundsPlaylistRef.current = undefined;
      currentSoundRef.current = undefined;
    }
  }, []);

  const playAudioNode = useCallback(
    async (node: DialogueNode, options?: PlayAudioOptions) => {
      stopPlayback();

      const playlist = getDialoguePlaylist(node, options?.playAllBranches);
      setPlaylist(playlist);

      function playSound(sound: Sound) {
        currentSoundRef.current = sound;
        sound.sound.play();

        sound.sound.once("play", () => {
          setNowNextDialogue((v) => ({
            ...v,
            loading: false,
            playing: true,
            now: sound.line,
          }));
        });

        sound.sound.once("end", async () => {
          if (!soundsPlaylistRef.current) return;

          const delay = (sound.line.duration ?? 0) * 100;
          const nextSound = getNextSound(sound, soundsPlaylistRef.current);
          await wait(delay);

          if (nextSound) {
            setNowNextDialogue((v) => ({ ...v, delay, next: nextSound.line }));
            playSound(nextSound);
          } else {
            setNowNextDialogue({
              next: soundsPlaylistRef.current[0].line,
              playing: true,
            });

            // We delay playing:false to give us a change to animate back to pos:0
            requestAnimationFrame(() => setNowNextDialogue({ playing: false }));
          }
        });
      }

      soundsPlaylistRef.current = playlist.map((line) => {
        const url = getMP3URL(line.audioFileName);
        const sound = new Howl({ src: [url] });

        return {
          sound,
          line,
        };
      });

      const firstSound = soundsPlaylistRef.current[0];
      setNowNextDialogue((v) => ({
        ...v,
        delay: 0,
        loading: true,
        next: firstSound.line,
      }));
      playSound(firstSound);
    },
    [stopPlayback]
  );

  const audioContextValue = useMemo(
    () => ({
      playAudioNode,
      stopPlayback,
    }),
    [playAudioNode, stopPlayback]
  );

  return {
    playAudioNode,
    playlist: playlistState,
    nowNextDialogue,
    audioContext: audioContextValue,
  };
};

export const useAudioPlayer = () => {
  const contextValue = useContext(audioContext);

  if (!contextValue) {
    throw new Error("Audio context not provided");
  }

  return contextValue;
};
