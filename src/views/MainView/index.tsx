import VirtualDialogueTree from "../../components/VirtualDialogueTree";
import Playback from "../../components/Playback";
import { DialogueBank, DialogueLine, CurrentDialogueState } from "../../types";
import s from "./styles.module.css";
import { Scrollbars } from "react-custom-scrollbars";
import { useCallback, useRef } from "react";
import { params } from "../../lib/utils";
import { spring } from "motion";
import { Animation } from "@motionone/animation";

interface MainViewProps {
  dialogueBanks: DialogueBank[];
  nowNextDialogue: CurrentDialogueState | undefined;
  playlist: DialogueLine[];
}

function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3);
}

export default function MainView(props: MainViewProps) {
  const scrollerRef = useRef<Scrollbars | null>();
  const { dialogueBanks, nowNextDialogue, playlist } = props;

  const renderThumb = useCallback(({ style, ...props }) => {
    const thumbStyle = {
      backgroundColor: "rgba(255,255,255,.75)",
      borderRadius: 100,
    };
    return <div style={{ ...style, ...thumbStyle }} {...props} />;
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

      const duration = Math.min(300, lineDelay);

      async function springAnimation() {
        const startTime = Date.now();

        const animationControls = new Animation(
          (progress) => {
            if (!scroller) return;
            scroller.scrollTop(progress);
          },
          [currentScrollPos, destinationPos],
          { easing: spring({ stiffness: 200, damping: 200 }) }
        );

        await animationControls.finished;
        const animationDuration = Date.now() - startTime;
        const msPerPixel = animationDuration / distance;
        console.log(
          "Took",
          animationDuration,
          "ms to travel",
          distance,
          "px - ",
          msPerPixel,
          "ms/pixel"
        );
      }

      async function fixedCubicAnimation() {
        if (params.delayScrollTo) {
          const animationDelay = Math.max(lineDelay - duration, 0);
          console.log("Delay animation by", animationDelay, "ms");
          await new Promise((resolve) => setTimeout(resolve, animationDelay));
        }

        const tick = () => {
          if (!scroller) return;

          if (start === 0) {
            start = Date.now();
          }

          const timePassed = Date.now() - start;
          const progress = Math.min(timePassed / duration, 1);
          const easedProgress = easeOutCubic(progress);

          const animationValue = easedProgress * distance;
          const newScrollTop = currentScrollPos + animationValue;

          scroller.scrollTop(newScrollTop);
          if (progress < 1) {
            requestAnimationFrame(tick);
          } else {
            console.log("Done animating");
          }
        };

        console.log("Will scroll to", destinationPos, "for", element);
        tick();
      }

      if (params.spring) {
        springAnimation();
      } else {
        fixedCubicAnimation();
      }
    },
    []
  );

  return (
    <div className={s.root}>
      <div className={s.main}>
        <VirtualDialogueTree dialogueBanks={dialogueBanks} />
      </div>

      <div className={s.side}>
        <Scrollbars
          renderThumbVertical={renderThumb}
          ref={(ref) => (scrollerRef.current = ref)}
        >
          <div className={s.sideInner}>
            <Playback
              nowNextDialogue={nowNextDialogue}
              playlist={playlist}
              requestScrollTo={onRequestScrollTo}
            />
          </div>
        </Scrollbars>
      </div>
    </div>
  );
}
