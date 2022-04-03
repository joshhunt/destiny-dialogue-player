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

interface AudioContext {
  playAudioNode: (node: DialogueNode) => Promise<void>;
  stopPlayback: () => void;
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
  node: DialogueNode | DialogueTree
): DialogueLine[] {
  if (node.type === "DialogueLine") {
    return [node];
  } else if (node.type === "DialogueSequence") {
    return node.sequence.flatMap((v) => getDialoguePlaylist(v));
  } else if (node.type === "DialogueBranch") {
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

// enum PlayingState {
//   NotStarted,
//   Playing,
//   Stopped,
// }

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
      setPlaylist([]);
      setNowNextDialogue({});
      soundsPlaylistRef.current = undefined;
      currentSoundRef.current = undefined;
    }
  }, []);

  const playAudioNode = useCallback(
    async (node: DialogueNode) => {
      stopPlayback();

      const playlist = getDialoguePlaylist(node);
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
        const url = `https://destiny-dialogue-project.s3.ap-southeast-2.amazonaws.com/audio/${line.audioFileName}.mp3`;
        const sound = new Howl({
          src: [url],
        });

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
