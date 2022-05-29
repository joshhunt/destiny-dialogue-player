import { useAudioPlayer } from "../lib/audioContext";
import { DialogueNode } from "../types";
import { useSearchContext } from "../views/MainView/searchContext";
import Button from "./Button";

interface Props {
  node: DialogueNode;
  label?: React.ReactNode;
  playAllBranches?: boolean;
}

export function PlayButton({ node, label, playAllBranches }: Props) {
  const { gender } = useSearchContext();
  const { playAudioNode } = useAudioPlayer();

  const handleClick = async () => {
    playAudioNode(node, { playAllBranches, gender });
  };

  return (
    <Button onClick={handleClick} icon="far fa-play">
      {label ?? "Play"}
    </Button>
  );
}
