import React from "react";
import { DialogueTable, FilteredDialogueTable } from "../../types";
import Button from "../Button";
import s from "./styles.module.css";
import { useGoTo } from "./useGoToNode";

interface DialogueBankNodeProps {
  node: DialogueTable | FilteredDialogueTable;
  id: string;
}

const DialogueBankNode: React.FC<DialogueBankNodeProps> = ({ node, id }) => {
  const goTo = useGoTo();

  let icon =
    node.type === "FilteredDialogueTable"
      ? "fa-file-magnifying-glass"
      : "fa-file";

  return (
    <>
      <span className="Space" />
      <i className={`fa-duotone ${icon}`}></i>
      <span className="Space" />
      Dialogue File {node.hash}
      {node.contentPath && (
        <>
          <span className="Space" />
          <span className={s.selectBoundry}> </span>
          <span className={s.faint}>{node.contentPath}</span>
          <span className={s.selectBoundry}> </span>
        </>
      )}
      {node.type === "FilteredDialogueTable" && (
        <>
          <span className="Space" />
          <Button
            icon="fa-regular fa-arrow-right-to-arc"
            onClick={() => goTo(node, id)}
          >
            Go to
          </Button>
        </>
      )}
    </>
  );
};

export default DialogueBankNode;
