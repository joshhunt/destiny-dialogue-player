import { useEffect, useRef } from "react";
import { DialogueLine, CurrentDialogueState } from "../../types";
import Coloured from "../ColoredText";

import s from "./styles.module.css";

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
    <div className={s.root}>
      {playlist.map((line) => (
        <div
          ref={(ref) => refMap.current.set(line, ref)}
          key={line.contentHash}
          className={
            currentDialogue?.contentHash === line.contentHash
              ? s.activeLine
              : s.inactiveLine
          }
        >
          <p className="Narrator">
            <Coloured text={line.narrator} />
          </p>
          <p className="Caption">{line.caption}</p>
        </div>
      ))}

      <div className={s.controls}>
        <button>Stop!</button>
      </div>
    </div>
  );
}
