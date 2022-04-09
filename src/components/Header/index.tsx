import React, { ChangeEvent, useCallback } from "react";
import { useSearchContext } from "../../views/MainView/searchContext";

import s from "./styles.module.css";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  const {
    narrators,
    selectedNarrator,
    setSelectedNarrator,
    searchText,
    setSearchText,
  } = useSearchContext();

  const handleNarratorChange = useCallback(
    (ev: ChangeEvent) => {
      if (ev.target instanceof HTMLSelectElement) {
        setSelectedNarrator(ev.target.value);
      }
    },
    [setSelectedNarrator]
  );

  const handleSearchChange = useCallback(
    (ev: ChangeEvent) => {
      if (ev.target instanceof HTMLInputElement) {
        setSearchText(ev.target.value);
      }
    },
    [setSearchText]
  );

  return (
    <div className={s.stickyHeader}>
      <div className={s.title}>Destiny Dialgoue Archive</div>

      <div>
        <input
          type="text"
          value={searchText ?? ""}
          onChange={handleSearchChange}
        />

        {narrators.length > 0 && (
          <select value={selectedNarrator} onChange={handleNarratorChange}>
            {narrators.map((narrator) => (
              <option key={narrator} value={narrator}>
                {narrator || "Unknown"}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};

export default Header;
