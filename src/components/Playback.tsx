import { DialogueLine } from "../types";
import Coloured from "./ColoredText";

interface Props {
  currentlyPlayingDialogue: DialogueLine | undefined;
  playlist: DialogueLine[];
}

export default function Playback({
  currentlyPlayingDialogue,
  playlist,
}: Props) {
  return (
    <div>
      {playlist.map((line) => (
        <div
          key={line.contentHash}
          className={
            currentlyPlayingDialogue?.contentHash === line.contentHash
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
