import React from "react";
import s from "./Offline.styles.module.css";

export default function Offline() {
  return (
    <div className={s.root}>
      <div className={s.box}>
        <h2>Destiny Dialogue Archive is temporarily offline</h2>
        <p>
          This project is temporarily offline for maintance to upgrade the
          backend to support more dialogue.
        </p>

        <p>See you soon!</p>
      </div>
    </div>
  );
}
