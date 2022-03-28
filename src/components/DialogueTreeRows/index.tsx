import React, { useCallback } from "react";
import { DialogueTree } from "../../types";
import CollapsableTableSection from "../CollapsableTableSection";
import DialogueNodeRow from "../DialogueNodeRow";

interface DialogueTreeRowsProps {
  tree: DialogueTree;
}

const DialogueTreeRows: React.FC<DialogueTreeRowsProps> = ({ tree }) => {
  const renderChildren = useCallback(() => {
    return (
      <DialogueNodeRow
        node={tree.dialogue}
        level={2}
        isInCollapsableSection={true}
      />
    );
  }, [tree]);

  const body = <>Conversation {tree.contentHash}</>;

  const accessory = (
    <button className="actionButton">
      <i className="far fa-play" /> Play
    </button>
  );

  return (
    <CollapsableTableSection
      body={body}
      accessory={accessory}
      level={1}
      renderChildren={renderChildren}
    />
  );
};

export default DialogueTreeRows;
