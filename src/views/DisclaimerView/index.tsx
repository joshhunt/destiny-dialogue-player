import React from "react";
import Header from "../../components/Header";

import s from "./styles.module.css";

interface DisclaimerViewProps {
  onApprove: () => void;
}

const DisclaimerView: React.FC<DisclaimerViewProps> = ({ onApprove }) => {
  return (
    <div className={s.root}>
      <Header hideControls />

      <div className={s.main}>
        <div className={s.box}>
          <h2 className={s.title}>First, just one thing!</h2>

          <p className={s.desc}>
            <strong>Destiny Definition Archive</strong> is a fan-made archive of
            Destiny's dialogue that's been removed from the game. Currently, it
            only contains dialogue from Destiny 2 3.4.0.4 (before Witch Queen).
          </p>

          <p className={s.desc}>
            This website should not contain spoilers, however no guarentees can
            be made. By continuing, you agree that you may accidently be exposed
            to spoilers for future content.
          </p>

          <p className={s.desc}>
            <a href="https://twitter.com/joshhunt">@joshhunt</a>
          </p>

          <button className={s.button} onClick={onApprove}>
            <span className={s.stopIcon}>
              <i className="fa-duotone fa-circle-check"></i>
            </span>
            I agree
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerView;
