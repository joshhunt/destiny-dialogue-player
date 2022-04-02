import { useAudioPlayer } from "../lib/audioContext";
import { DialogueNode } from "../types";

interface Props {
  node: DialogueNode;
}

export function PlayButton({ node }: Props) {
  const { playAudioNode } = useAudioPlayer();
  const handleClick = async () => {
    playAudioNode(node);
  };

  return (
    <button onClick={handleClick} className="actionButton">
      <i className="far fa-play" /> Play
    </button>
  );
}
