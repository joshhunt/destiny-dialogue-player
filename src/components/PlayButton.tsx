import { useAudioContext } from "../lib/audioContext";
import { DialogueNode } from "../types";

interface Props {
  node: DialogueNode;
}

export function PlayButton({ node }: Props) {
  const { audioPlayer } = useAudioContext() ?? {};

  const handleClick = async () => {
    audioPlayer && audioPlayer.playNode(node);

    // const playlist = playlistFromNode(node);
    // console.log("playlist:", playlist);
    // const audioInstances = playlist.map(audioUrlForLine).map(createAudio);
    // for (const audio of audioInstances) {
    //   await playAudio(audio);
    // }
  };

  return (
    <button onClick={handleClick} className="actionButton">
      <i className="far fa-play" /> Play
    </button>
  );
}
