import { formattedSummary } from "../lib/utils";
import { DialogueNode as DialogueNodeType } from "../types";
import DialogueTable from "./DialogueTable";
import NodeChildren from "./NodeChildren";

interface Props {
  node: DialogueNodeType;
  level: number;
}

export default function DialogueNode({ node, level }: Props) {
  if (node.Type === "DialogueSequence") {
    const summary = formattedSummary(node.Sequence);
    return (
      <NodeChildren
        level={level}
        node={node}
        title="Sequence"
        verboseTitle={summary}
      />
    );
  }

  if (node.Type === "DialogueCollection") {
    const summary = formattedSummary(node.Collection);
    return (
      <NodeChildren
        level={level}
        node={node}
        title="Options"
        verboseTitle={summary}
      />
    );
  }

  if (node.Type === "DialogueLine") {
    return <DialogueTable line={node} level={level} />;
  }

  return (
    <tr>
      <td>Unknown dialogue type</td>
    </tr>
  );
}
