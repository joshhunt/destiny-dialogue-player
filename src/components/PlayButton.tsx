import { Howl } from "howler";
import sample from "lodash/sample";
import { useAudioContext } from "../lib/audioContext";
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

export function PlayButton({ node }: Props) {
  const { audioPlayer } = useAudioContext() ?? {};

  const handleClick = async () => {
    // audioPlayer && audioPlayer.playNode(node);

    const playlist = getDialoguePlaylist(node);
    const toLog = playlist.map((v) => ({
      narrator: v.narrator,
      caption: v.caption,
      audioFile: v.audioFileName,
    }));
    console.log("Going to play:");
    console.table(toLog);

    const sounds = playlist.map((line) => {
      const url = `https://destiny-dialogue-project.s3.ap-southeast-2.amazonaws.com/audio/${line.audioFileName}`;

      return new Howl({
        src: [url],
      });
    });

    for (let index = 0; index < sounds.length; index++) {
      const sound = sounds[index];
      const nextSound = sounds[index + 1];

      sound.once("playerror", (err: unknown) => {
        console.log("playerror", err);
      });

      sound.once("loaderror", (err: unknown) => {
        console.log("loaderror", err);
      });

      if (nextSound) {
        sound.once("end", () => {
          nextSound.play();
        });
      }
    }

    sounds[0].play();
  };

  return (
    <button onClick={handleClick} className="actionButton">
      <i className="far fa-play" /> Play
    </button>
  );
}
