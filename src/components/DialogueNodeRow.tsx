import { formattedSummary } from "../lib/utils";
import { DialogueNode as DialogueNodeType } from "../types";
import DialogueLineRow from "./DialogueLineRow";
import DialogueCollectionRow from "./DialogueCollectionRow";

interface Props {
  node: DialogueNodeType;
  isInCollapsableSection?: boolean;
  level: number;
}

export default function DialogueNode({
  node,
  level,
  isInCollapsableSection,
}: Props) {
  if (node.type === "DialogueSequence") {
    const summary = formattedSummary(node.sequence);
    return (
      <DialogueCollectionRow
        level={level}
        node={node}
        title="Sequence"
        verboseTitle={summary}
      />
    );
  }

  if (node.type === "DialogueBranch") {
    const summary = formattedSummary(node.options);
    return (
      <DialogueCollectionRow
        level={level}
        node={node}
        title="Options"
        verboseTitle={summary}
      />
    );
  }

  if (node.type === "DialogueLine") {
    return (
      <DialogueLineRow
        line={node}
        level={level}
        isInCollapsableSection={isInCollapsableSection}
      />
    );
  }

  return (
    <tr>
      <td>Unknown dialogue type</td>
    </tr>
  );
}
