import { useCallback, useState } from "react";
import { DialogueBranch, DialogueSequence } from "../../types";
import CollapsableTableSection from "../CollapsableTableSection";
import DialogueNode from "../DialogueNodeRow";
import { PlayButton } from "../PlayButton";

interface Props {
  node: DialogueSequence | DialogueBranch;
  title: string;
  verboseTitle: React.ReactNode;
  level: number;
}

function getChildren(node: Props["node"]) {
  if (node.type === "DialogueBranch") {
    return node.options;
  }

  if (node.type === "DialogueSequence") {
    return node.sequence;
  }

  throw new Error("Invalid");
}

export default function DialogueCollectionRow({
  node,
  title,
  level,
  verboseTitle,
}: Props) {
  const [childrenIsVisible, setChildrenIsVisible] = useState(false);
  const childNodes = getChildren(node);

  const renderChildren = useCallback(() => {
    return (
      <>
        {childNodes.map((child, index) => (
          <DialogueNode
            key={index}
            node={child}
            level={level + 1}
            isInCollapsableSection={true}
          />
        ))}
      </>
    );
  }, [childNodes, level]);

  const body = childrenIsVisible ? (
    title
  ) : (
    <>
      {title} - {verboseTitle}
    </>
  );

  const accessory = <PlayButton node={node} />;

  return (
    <CollapsableTableSection
      level={level}
      body={body}
      accessory={accessory}
      renderChildren={renderChildren}
      onToggle={setChildrenIsVisible}
    />
  );
}
