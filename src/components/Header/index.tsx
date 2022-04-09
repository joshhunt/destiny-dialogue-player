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

      {narrators.length > 0 && (
        <div className={s.extraItems}>
          <div className={s.searchBox}>
            <i className="fa-regular fa-magnifying-glass" />

            <input
              type="text"
              value={searchText ?? ""}
              onChange={handleSearchChange}
              className={s.searchInput}
            />
          </div>

          <span className="Space" />
          <span className="Space" />
          <span className="Space" />

          <>
            <label htmlFor="narrator-select">Narrator:</label>
            <select
              id="narrator-select"
              className={s.narratorSelect}
              value={selectedNarrator}
              onChange={handleNarratorChange}
            >
              <option>All</option>
              {narrators.map((narrator) => (
                <option key={narrator} value={narrator}>
                  {narrator || "Unknown"}
                </option>
              ))}
            </select>
          </>
        </div>
      )}
    </div>
  );
};

export default Header;
