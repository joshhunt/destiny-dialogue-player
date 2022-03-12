import { useState } from "react";
import { DialogueCollection, DialogueSequence } from "../types";
import DialogueNode from "./DialogueNode";
import Indent from "./Indent";
import { PlayButton } from "./PlayButton";

interface Props {
  node: DialogueSequence | DialogueCollection;
  title: string;
  verboseTitle: React.ReactNode;
  level: number;
}

function getChildren(node: Props["node"]) {
  if (node.Type === "DialogueCollection") {
    return node.Collection;
  }

  if (node.Type === "DialogueSequence") {
    return node.Sequence;
  }

  throw new Error("Invalid");
}

export default function NodeChildren({
  node,
  title,
  level,
  verboseTitle,
}: Props) {
  const [childrenIsVisible, setChildrenIsVisible] = useState(level < 30);
  const handleToggleClick = () => setChildrenIsVisible((v) => !v);
  const childNodes = getChildren(node);

  return (
    <>
      <tr>
        <td>
          <Indent level={level} />

          <span className="meta v-align">
            <button className="toggleButton" onClick={handleToggleClick}>
              {childrenIsVisible ? (
                <i className="far fa-chevron-down" />
              ) : (
                <i className="far fa-chevron-right" />
              )}
            </button>
            <span className="Space"></span>

            {childrenIsVisible ? (
              `${title}:`
            ) : (
              <span>
                {title} - {verboseTitle}
              </span>
            )}
          </span>
        </td>
        <td />
        <td>
          <PlayButton node={node} />
        </td>
      </tr>

      {childrenIsVisible &&
        childNodes.map((child, index) => (
          <DialogueNode key={index} node={child} level={level + 1} />
        ))}
    </>
  );
}
