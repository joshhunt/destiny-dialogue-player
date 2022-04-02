import { useEffect, useRef } from "react";
import { DialogueLine, CurrentDialogueState } from "../types";
import Coloured from "./ColoredText";

interface Props {
  nowNextDialogue: CurrentDialogueState | undefined;
  playlist: DialogueLine[];
  requestScrollTo: (
    element: HTMLDivElement,
    dialogue: DialogueLine,
    delay: number
  ) => void;
}

export default function Playback({
  nowNextDialogue,
  playlist,
  requestScrollTo,
}: Props) {
  const refMap = useRef(new Map<DialogueLine, HTMLDivElement | null>());
  const {
    now: currentDialogue,
    delay,
    next: nextDialogue,
  } = nowNextDialogue ?? {};

  useEffect(() => {
    if (nextDialogue) {
      const element = refMap.current.get(nextDialogue);
      if (element) {
        requestScrollTo(element, nextDialogue, delay ?? 0);
      }
    }
  }, [requestScrollTo, delay, nextDialogue]);

  return (
    <div>
      {playlist.map((line) => (
        <div
          ref={(ref) => refMap.current.set(line, ref)}
          key={line.contentHash}
          className={
            currentDialogue?.contentHash === line.contentHash
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
