import { useCallback } from "react";
import { useAudioPlayer } from "../lib/audioContext";
import { DialogueNode } from "../types";
import { useSearchContext } from "../views/MainView/searchContext";
import Button from "./Button";
import { TreeNode } from "./VirtualDialogueTree/types";

interface Props {
  node: DialogueNode;
  label?: React.ReactNode;
  playAllBranches?: boolean;
}

export function PlayButton({ node, label, playAllBranches }: Props) {
  const handleClick = usePlayAudio({ node, playAllBranches });

  return (
    <Button onClick={handleClick} icon="far fa-play">
      {label ?? "Play"}
    </Button>
  );
}

export function usePlayAudio({
  node,
  playAllBranches,
}: {
  node: TreeNode;
  playAllBranches?: boolean;
}) {
  const { gender } = useSearchContext();
  const { playAudioNode } = useAudioPlayer();

  const handleClick = useCallback(() => {
    if (
      node.type === "DialogueSequence" ||
      node.type === "DialogueBranch" ||
      node.type === "DialogueLine"
    ) {
      playAudioNode(node, { playAllBranches, gender });
    }
  }, [gender, node, playAllBranches, playAudioNode]);

  return handleClick;
}
