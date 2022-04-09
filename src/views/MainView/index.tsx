import VirtualDialogueTree from "../../components/VirtualDialogueTree";
import Playback from "../../components/Playback";
import { DialogueBank, DialogueLine, CurrentDialogueState } from "../../types";
import s from "./styles.module.css";
import { Scrollbars } from "react-custom-scrollbars";
import { useCallback, useRef, useState } from "react";
import { params } from "../../lib/utils";
import { spring } from "motion";
import { Animation } from "@motionone/animation";
import _MainViewLoadingStates from "./LoadingStates";

export const MainViewLoadingStates = _MainViewLoadingStates;

interface MainViewProps {
  dialogueBanks: DialogueBank[];
  nowNextDialogue: CurrentDialogueState;
  playlist: DialogueLine[];
}

const pow = Math.pow;

function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3);
}

function easeOutExpo(x: number): number {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

function easeInOutExpo(x: number): number {
  return x === 0
    ? 0
    : x === 1
    ? 1
    : x < 0.5
    ? pow(2, 20 * x - 10) / 2
    : (2 - pow(2, -20 * x + 10)) / 2;
}

function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - pow(-2 * x + 2, 3) / 2;
}

export default function MainView(props: MainViewProps) {
  const scrollerRef = useRef<Scrollbars | null>();
  const { dialogueBanks, nowNextDialogue, playlist } = props;

  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const renderThumb = useCallback(({ style, ...props }) => {
    return <div className={s.scrollerThumb} style={style} {...props} />;
  }, []);

  const renderTrack = useCallback(({ style, ...props }) => {
    return <div className={s.scrollerTrack} style={style} {...props} />;
  }, []);

  const onRequestScrollTo = useCallback(
    async (
      element: HTMLDivElement,
      dialogue: DialogueLine,
      lineDelay: number
    ) => {
      const scroller = scrollerRef.current;
      if (!scroller) return;
      const currentScrollValues = scroller.getValues();
      const currentScrollPos = currentScrollValues.scrollTop;

      // Figure out what's the maximum amount we can scroll by and clamp to that
      // to prevent weird animations
      const maxScrollTop =
        currentScrollValues.scrollHeight - currentScrollValues.clientHeight;

      const destinationPos = Math.min(element.offsetTop - 33, maxScrollTop);
      const distance = destinationPos - currentScrollPos;

      let start = 0;

      const duration = Math.min(500, lineDelay);

      async function springAnimation() {
        setIsAnimating(true);

        const animationProgress = new Animation(
          (progress) => {
            setIsAnimating(true);
            if (!scroller) return;
            scroller.scrollTop(progress);
          },
          [currentScrollPos, destinationPos],
          { easing: spring({ stiffness: 150, damping: 200 }) }
        );

        await animationProgress.finished;
        setIsAnimating(false);
      }

      async function fixedCubicAnimation() {
        if (!params.noDelayScrollTo) {
          const animationDelay = Math.max(lineDelay - duration, 0);
          await new Promise((resolve) => setTimeout(resolve, animationDelay));
        }

        const tick = () => {
          if (!scroller) return;

          if (start === 0) {
            start = Date.now();
          }

          const timePassed = Date.now() - start;
          const progress = Math.min(timePassed / duration, 1);
          if (params.easeOutExpo) {
          }

          let easedProgress = progress;

          if (params.easeOutExpo) {
            easedProgress = easeOutExpo(progress);
          } else if (params.easeInOutExpo) {
            easedProgress = easeInOutExpo(progress);
          } else if (params.easeInOutCubic) {
            easedProgress = easeInOutCubic(progress);
          } else {
            easedProgress = easeOutCubic(progress);
          }

          const animationValue = easedProgress * distance;
          const newScrollTop = currentScrollPos + animationValue;

          scroller.scrollTop(newScrollTop);
          if (progress < 1) {
            requestAnimationFrame(tick);
          }
        };
        tick();
      }

      if (params.fixedDuration) {
        fixedCubicAnimation();
      } else {
        springAnimation();
      }
    },
    []
  );

  return (
    <div className={s.root}>
      <div className={s.main}>
        <VirtualDialogueTree dialogueBanks={dialogueBanks} />
      </div>

      {playlist.length > 0 && (
        <div className={s.side}>
          <Scrollbars
            autoHide
            renderThumbVertical={renderThumb}
            renderTrackVertical={renderTrack}
            ref={(ref) => (scrollerRef.current = ref)}
          >
            <Playback
              nowNextDialogue={nowNextDialogue}
              playlist={playlist}
              requestScrollTo={onRequestScrollTo}
              isAnimating={isAnimating}
            />
          </Scrollbars>
        </div>
      )}
    </div>
  );
}
