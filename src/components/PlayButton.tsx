import { useAudioPlayer } from "../lib/audioContext";
import { DialogueNode } from "../types";
import Button from "./Button";

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
    <Button onClick={handleClick} icon="far fa-play">
      {label ?? "Play"}
    </Button>
  );
}
