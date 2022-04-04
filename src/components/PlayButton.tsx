import { useAudioPlayer } from "../lib/audioContext";
import { DialogueNode } from "../types";

interface Props {
  node: DialogueNode;
  label?: React.ReactNode;
  playAllBranches?: boolean;
}

export function PlayButton({ node, label, playAllBranches }: Props) {
  const { playAudioNode } = useAudioPlayer();
  const handleClick = async () => {
    playAudioNode(node, { playAllBranches });
  };

  return (
    <button onClick={handleClick} className="actionButton">
      <i className="far fa-play" /> {label ?? "Play"}
    </button>
  );
}
