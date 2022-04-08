import React, { ChangeEvent, useCallback } from "react";
import { useSearchContext } from "../../views/MainView/useNarratorFilter";

import s from "./styles.module.css";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  const { narrators, selectedNarrator, setSelectedNarrator } =
    useSearchContext();

  const handleNarratorChange = useCallback(
    (ev: ChangeEvent) => {
      if (ev.target instanceof HTMLSelectElement) {
        setSelectedNarrator(ev.target.value);
      }
    },
    [setSelectedNarrator]
  );

  return (
    <div className={s.stickyHeader}>
      <div className={s.title}>Destiny Dialgoue Archive</div>

      {narrators.length > 0 && (
        <select value={selectedNarrator} onChange={handleNarratorChange}>
          {narrators.map((narrator) => (
            <option key={narrator} value={narrator}>
              {narrator}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default Header;
