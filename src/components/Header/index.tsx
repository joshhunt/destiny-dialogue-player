import React from "react";

import s from "./styles.module.css";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  return (
    <div className={s.stickyHeader}>
      <div className={s.title}>Destiny Dialgoue Archive</div>
    </div>
  );
};

export default Header;
