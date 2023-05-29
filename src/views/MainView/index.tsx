import VirtualDialogueTree from "../../components/VirtualDialogueTree";
import Playback from "../../components/Playback";
import { DialogueLine, CurrentDialogueState } from "../../types";
import s from "./styles.module.css";
import { useCallback, useRef, useState } from "react";
import { spring } from "motion";
import { Animation } from "@motionone/animation";
import _MainViewLoadingStates from "./LoadingStates";
import { RootDialogueCollection } from "../../components/VirtualDialogueTree/types";

export const MainViewLoadingStates = _MainViewLoadingStates;

interface MainViewProps {
  dialogueBanks: RootDialogueCollection;
  nowNextDialogue: CurrentDialogueState;
  playlist: DialogueLine[];
}

export default function MainView(props: MainViewProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const { dialogueBanks, nowNextDialogue, playlist } = props;

  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const onRequestScrollTo = useCallback(async (element: HTMLDivElement) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const currentScrollPos = scroller.scrollTop;

    // Calculate out what's the maximum amount we can scroll by and clamp to that
    // to prevent weird animations
    const maxScrollTop = scroller.scrollHeight - scroller.clientHeight;

    const destinationPos = Math.min(element.offsetTop - 33, maxScrollTop);

    async function springAnimation() {
      setIsAnimating(true);

      const animationProgress = new Animation(
        (progress) => {
          setIsAnimating(true);
          if (!scroller) return;

          scroller.scrollTo({
            top: progress,
          });
        },
        [currentScrollPos, destinationPos],
        { easing: spring({ stiffness: 150, damping: 200 }) }
      );

      await animationProgress.finished;
      setIsAnimating(false);
    }

    springAnimation();
  }, []);

  return (
    <div className={s.root}>
      <div className={s.main}>
        <VirtualDialogueTree dialogueBanks={dialogueBanks} />
      </div>

      {playlist.length > 0 && (
        <>
          <div className={s.side} ref={scrollerRef}>
            <Playback
              nowNextDialogue={nowNextDialogue}
              playlist={playlist}
              requestScrollTo={onRequestScrollTo}
              isAnimating={isAnimating}
            />
          </div>

          <div className={s.backdrop} />
        </>
      )}
    </div>
  );
}
