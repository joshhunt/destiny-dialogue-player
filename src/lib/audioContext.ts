import { Howl } from "howler";
import sample from "lodash/sample";
import React, { useCallback, useContext, useMemo, useState } from "react";
import {
  DialogueLine,
  DialogueNode,
  DialogueTree,
  CurrentDialogueState,
} from "../types";
import { params } from "./utils";

interface AudioContext {
  playAudioNode: (node: DialogueNode) => Promise<void>;
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

export const useAudioState = () => {
  const [playlistState, setPlaylist] = useState<DialogueLine[]>([]);
  const [nowNextDialogue, setNowNextDialogue] = useState<CurrentDialogueState>(
    {}
  );

  // const currentAudioPlayerRef = useRef();

  const playAudioNode = useCallback(async (node: DialogueNode) => {
    const playlist = getDialoguePlaylist(node);
    setPlaylist(playlist);

    const soundLineMap = new Map<Howl, DialogueLine>();
    const sounds = playlist.map((line) => {
      const url = `https://destiny-dialogue-project.s3.ap-southeast-2.amazonaws.com/audio/${line.audioFileName}`;
      const sound = new Howl({
        src: [url],
      });

      soundLineMap.set(sound, line);

      return {
        sound,
        line,
      };
    });

    for (let index = 0; index < sounds.length; index++) {
      const { sound, line } = sounds[index];
      const { sound: nextSound, line: nextLine } = sounds[index + 1] ?? {};

      soundLineMap.set(sound, line);
      sound.once("play", () => {
        console.log("Playing", line.caption);

        setNowNextDialogue((cur) => ({ ...cur, now: line }));
      });

      sound.once("playerror", (err: unknown) => console.log("playerror", err));
      sound.once("loaderror", (err: unknown) => console.log("loaderror", err));

      if (nextSound) {
        sound.once("end", async () => {
          const thisLine = soundLineMap.get(sound);
          const delay = ((thisLine?.duration ?? 0) / 10) * 1000; // * 100
          console.log("Delay", delay, "ms");

          if (params.clearNow) {
            setNowNextDialogue((cur) => ({
              ...cur,
              now: undefined,
              delay,
              next: nextLine,
            }));
          } else {
            setNowNextDialogue((cur) => ({
              ...cur,
              delay,
              next: nextLine,
            }));
          }

          await wait(Math.min(delay, 1000));
          nextSound.play();
        });
      } else {
        sound.once("end", async () => {
          const thisLine = soundLineMap.get(sound);
          const delay = ((thisLine?.duration ?? 0) / 10) * 1000; // * 100
          console.log("Delay", delay, "ms");

          setNowNextDialogue((cur) => ({}));
          await wait(Math.min(delay, 1000));
        });
      }
    }

    setNowNextDialogue((cur) => ({
      ...cur,
      delay: 0,
      next: sounds[0].line,
    }));
    sounds[0].sound.play();
  }, []);

  const audioContextValue = useMemo(
    () => ({
      playAudioNode,
    }),
    [playAudioNode]
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
