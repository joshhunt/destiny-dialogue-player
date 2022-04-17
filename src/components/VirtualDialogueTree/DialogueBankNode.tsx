import React from "react";
import { DialogueBank, FilteredDialogueBank } from "../../types";
import s from "./styles.module.css";

interface DialogueBankNodeProps {
  node: DialogueBank | FilteredDialogueBank;
}

const DialogueBankNode: React.FC<DialogueBankNodeProps> = ({ node }) => {
  let icon =
    "type" in node && node.type === "FilteredDialogueBank"
      ? "fa-file-magnifying-glass"
      : "fa-file";

  return (
    <>
      <span className="Space" />
      <i className={`fa-duotone ${icon}`}></i>
      <span className="Space" />
      Dialogue File {node.entryKey}
      <span className="Space" />/<span className="Space" />
      {node.contentHash}
      {node.contentPath && (
        <>
          <span className="Space" />
          <span className={s.selectBoundry}> </span>
          <span className={s.faint}>{node.contentPath}</span>
          <span className={s.selectBoundry}> </span>
        </>
      )}
    </>
  );
};

export default DialogueBankNode;
