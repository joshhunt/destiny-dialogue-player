import { useEffect, useRef } from "react";
import { useAudioContext } from "../../lib/audioContext";
import { DialogueLine, CurrentDialogueState } from "../../types";
import Coloured from "../ColoredText";
import { CSSTransition } from "react-transition-group";
import cx from "classnames";

import s from "./styles.module.css";

interface Props {
  nowNextDialogue: CurrentDialogueState;
  playlist: DialogueLine[];
  isAnimating: boolean;
  requestScrollTo: (
    element: HTMLDivElement,
    dialogue: DialogueLine,
    delay: number
  ) => void;
}

export default function Playback({
  nowNextDialogue,
  playlist,
  isAnimating,
  requestScrollTo,
}: Props) {
  const { stopPlayback, clearDialogue } = useAudioContext();
  const refMap = useRef(new Map<DialogueLine, HTMLDivElement | null>());
  const {
    now: currentDialogue,
    delay,
    playing,
    loading,
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
      {playlist.map((line, index) => (
        <div
          ref={(ref) => refMap.current.set(line, ref)}
          key={line.contentHash}
          className={cx(
            playing ?? loading
              ? currentDialogue?.contentHash === line.contentHash
                ? s.activeLine
                : s.inactiveLine
              : s.restLine,
            (isAnimating || playing) &&
              index === playlist.length - 1 &&
              s.lastLine
          )}
        >
          <p className="Narrator">
            {line.narrator?.trim() ? (
              <Coloured text={line.narrator} />
            ) : (
              <em style={{ color: "#b7b7b7" }}>Unknown</em>
            )}
          </p>
          <p className="Caption">{line.caption}</p>
        </div>
      ))}

      <div className={s.controls}>
        <CSSTransition
          in={playing}
          timeout={200}
          classNames={{
            appear: s.controlsAppear,
            appearActive: s.controlsAppearActive,
            appearDone: s.controlsAppearDone,
            enter: s.controlsEnter,
            enterActive: s.controlsEnterActive,
            enterDone: s.controlsEnterDone,
            exit: s.controlsExit,
            exitActive: s.controlsExitActive,
            exitDone: s.controlsExitDone,
          }}
        >
          <button
            className={cx(playing ? s.stopButton : s.stopButtonInactive)}
            onClick={stopPlayback}
          >
            <span className={s.stopIcon}>
              <i className="fa-regular fa-circle-stop"></i>
            </span>
            Stop playback
          </button>
        </CSSTransition>

        <button className={s.closeButton} onClick={clearDialogue}>
          <span className={s.stopIcon}>
            <i className="fa-regular fa-circle-stop"></i>
          </span>
          Close
        </button>
      </div>
    </div>
  );
}
