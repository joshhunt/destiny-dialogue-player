import React, { useCallback } from "react";
import { Link } from "wouter";
import { DialogueTable, FilteredDialogueTable } from "../../types";
import { useSearchContext } from "../../views/MainView/searchContext";
import { AppLink } from "../Button";
import s from "./styles.module.css";

interface DialogueBankNodeProps {
  node: DialogueTable | FilteredDialogueTable;
  id: string;
}

const DialogueBankNode: React.FC<DialogueBankNodeProps> = ({ node, id }) => {
  const { setSelectedNarrator, setSearchText } = useSearchContext();

  const clearSearch = useCallback(() => {
    setSelectedNarrator(undefined);
    setSearchText(undefined);
  }, [setSearchText, setSelectedNarrator]);

  let icon =
    node.type === "FilteredDialogueTable"
      ? "fa-file-magnifying-glass"
      : "fa-file";

  return (
    <>
      <span className="Space" />
      <i className={`fa-duotone ${icon}`}></i>
      <span className="Space" />
      <Link className={s.link} to={`/d/${node.hash}`} onClick={clearSearch}>
        Dialogue Table {node.hash}
      </Link>
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
          <AppLink
            icon="fa-regular fa-arrow-right-to-arc"
            to={`/d/${node.hash}`}
            onClick={clearSearch}
          >
            Go to table
          </AppLink>
        </>
      )}
    </>
  );
};

export default DialogueBankNode;
