import { DialogueLine as DialogueLineType } from "../types";
import Indent from "./Indent";
import { PlayButton } from "./PlayButton";

interface Props {
  line: DialogueLineType;
  level: number;
}

export default function DialoguedLine({ line, level }: Props) {
  return (
    <tr>
      <td className="dialogue-cell">
        <Indent level={level} /> <span className="toggleButtonSpacer" />{" "}
        {line.Caption}
      </td>
      <td className="narratorCell">{line.Narrator}</td>
      <td>
        <PlayButton node={line} />
      </td>
    </tr>
  );
}
