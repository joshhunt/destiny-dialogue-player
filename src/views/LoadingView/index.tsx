import React from "react";
import { LoadingProgress } from "../../lib/useDialogueBanks";
import Header from "../../components/Header";

import s from "./styles.module.css";

interface LoadingViewProps {
  progress: LoadingProgress | undefined;
}

const LoadingView: React.FC<LoadingViewProps> = ({ progress }) => {
  const percent = progress && (progress.progress / progress.total) * 100;

  return (
    <div className={s.root}>
      <Header hideControls={true} />

      <div className={s.main}>
        <p>Loading...</p>
        <div className={s.progressBar}>
          <div
            className={s.progressBarTrack}
            style={{ width: `${percent}%` }}
            data-value={progress?.progress ?? 0}
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingView;
