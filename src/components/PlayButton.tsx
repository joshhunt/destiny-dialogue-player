import { Howl } from "howler";
import sample from "lodash/sample";
import { DialogueLine, DialogueNode, DialogueTree } from "../types";

interface Props {
  node: DialogueNode;
}

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

const wait = (timeout: number) =>
  new Promise((resolve) => setTimeout(resolve, timeout));

export function PlayButton({ node }: Props) {
  const handleClick = async () => {
    const playlist = getDialoguePlaylist(node);
    // const toLog = playlist.map((v) => ({
    //   narrator: v.narrator,
    //   caption: v.caption,
    //   delayToNextLineMs: v.duration * 100,
    //   audioFile: v.audioFileName,
    // }));
    // console.table(toLog);

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
      const { sound: nextSound } = sounds[index + 1] ?? {};

      soundLineMap.set(sound, line);

      // sound.once("load", () => {
      //   const audioDuration = sound.duration();
      //   const delay = line.duration - audioDuration;

      //   console.log("Line duration", line.duration);
      //   console.log("  Audio file duration", audioDuration);
      //   soundDelayMap.set(sound, delay);
      //   console.log("  Line delay", delay);
      // });

      sound.once("play", () => {
        console.log("Playing", line.caption);
      });

      sound.once("playerror", (err: unknown) => {
        console.log("playerror", err);
      });

      sound.once("loaderror", (err: unknown) => {
        console.log("loaderror", err);
      });

      if (nextSound) {
        sound.once("end", async () => {
          const thisLine = soundLineMap.get(sound);
          const delay = ((thisLine?.duration ?? 0) / 10) * 1000; // * 100
          console.log("Delay", delay, "ms");

          await wait(Math.min(delay, 1000));
          nextSound.play();
        });
      }
    }

    sounds[0].sound.play();
  };

  return (
    <button onClick={handleClick} className="actionButton">
      <i className="far fa-play" /> Play
    </button>
  );
}
