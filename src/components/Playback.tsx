import { DialogueLine } from "../types";
import Coloured from "./ColoredText";

interface Props {
  lines: DialogueLine[];
}

export default function Playback({ lines }: Props) {
  return (
    <div>
      {lines.map((line, index) => (
        <div
          className={
            index === 1
              ? "playbackLine activeLine"
              : "playbackLine inactiveLine"
          }
        >
          <p className="Narrator">
            <Coloured text={line.narrator} />
          </p>
          <p className="Caption">{line.caption}</p>
        </div>
      ))}
    </div>
  );
}
