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
  const { stopPlayback } = useAudioContext();
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
      {/* <CSSTransition
        in={loading}
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
        <div className={s.loading}>
          <i className="fa-solid fa-spinner-third fa-spin"></i>
          Loading...
        </div>
      </CSSTransition> */}

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
            <Coloured text={line.narrator} />
          </p>
          <p className="Caption">{line.caption}</p>
        </div>
      ))}

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
        <div className={cx(playing ? s.controls : s.controlsInactive)}>
          <button className={s.stopButton} onClick={stopPlayback}>
            <span className={s.stopIcon}>
              <i className="fa-regular fa-circle-stop"></i>
            </span>
            Stop playback
          </button>
        </div>
      </CSSTransition>
    </div>
  );
}
