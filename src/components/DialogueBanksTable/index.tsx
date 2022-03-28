import { Fragment } from "react";
import { DialogueBank } from "../../types";
import DialogueTreeRows from "../DialogueTreeRows";
import Indent from "../Indent";

import s from "./styles.module.css";

interface DialogueBanksTableProps {
  dialogueBanks: DialogueBank[];
}

export default function DialogueBanksTable(props: DialogueBanksTableProps) {
  const { dialogueBanks } = props;

  return (
    <table className={s.table}>
      <thead className={s.header}>
        <tr>
          <td className={s.expand}>
            <Indent level={1} /> Dialogue
          </td>

          <td className={s.shrink}>Narrator</td>

          <td className={s.shrink}></td>
        </tr>
      </thead>

      <tbody>
        {dialogueBanks.map((dialogueBank) => {
          return (
            <Fragment key={dialogueBank.contentHash}>
              <tr>
                <td colSpan={3}>
                  Dialogue file {dialogueBank.entryKey} /{" "}
                  {dialogueBank.contentHash}
                </td>
              </tr>

              {dialogueBank.dialogues.map((dialogueTree) => {
                return (
                  <DialogueTreeRows
                    tree={dialogueTree}
                    key={dialogueTree.contentHash}
                  />
                );
              })}
            </Fragment>
          );
        })}
      </tbody>
    </table>
  );
}
