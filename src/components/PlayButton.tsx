import { useAudioPlayer } from "../lib/audioContext";
import { DialogueNode } from "../types";

interface Props {
  node: DialogueNode;
  label?: React.ReactNode;
}

export function PlayButton({ node, label }: Props) {
  const { playAudioNode } = useAudioPlayer();
  const handleClick = async () => {
    playAudioNode(node);
  };

  return (
    <button onClick={handleClick} className="actionButton">
      <i className="far fa-play" /> {label ?? "Play"}
    </button>
  );
}
