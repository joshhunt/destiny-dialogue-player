import { DialogueLine as DialogueLineType } from "../../types";
import Indent from "../Indent";
import { PlayButton } from "../PlayButton";

import s from "./styles.module.css";

interface DialogueLineRowProps {
  line: DialogueLineType;
  level: number;
  isInCollapsableSection?: boolean;
}

export default function DialogueLineRow({
  line,
  level,
  isInCollapsableSection,
}: DialogueLineRowProps) {
  return (
    <tr>
      <td className={s.dialogueCell}>
        <Indent level={level} />
        {isInCollapsableSection && <span className="toggleButtonSpacer" />}
        <span className={s.narrator}>{line.narrator}:</span> {line.caption}
      </td>

      <td>{line.narrator}</td>

      <td>
        <PlayButton node={line} />
      </td>
    </tr>
  );
}
