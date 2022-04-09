import React from "react";
import Header from "../../components/Header";

import s from "./styles.module.css";

interface ErrorViewProps {
  error: any;
}

const ErrorView: React.FC<ErrorViewProps> = ({ error }) => {
  let errorString = error?.message ?? "";

  if (error.stack) {
    errorString += "\n" + error.stack;
  }

  return (
    <div className={s.root}>
      <Header hideControls={true} />

      <div className={s.main}>
        <div className={s.box}>
          <h2 className={s.title}>Oh no! Website made a fucky wucky 🥺</h2>
          <p className={s.desc}>
            There was an error loading dialogue files. Maybe try again later?
          </p>
          {errorString && <pre className={s.exception}>{errorString}</pre>}
          <p className={s.desc}>
            <a href="https://twitter.com/joshhunt">@joshhunt</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorView;
