import React, { ChangeEvent, useCallback } from "react";
import { Link } from "wouter";
import { useDialogueRoute } from "../../lib/useRoute";

import { useSearchContext } from "../../views/MainView/searchContext";
import AboutModal from "../AboutModal";

import s from "./styles.module.css";

interface HeaderProps {
  hideControls?: boolean;
}

const ALL_VALUE = "$$all";

const Header: React.FC<HeaderProps> = ({ hideControls }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [match, params] = useDialogueRoute();
  const [modalIsOpen, setIsOpen] = React.useState(false);

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
        setSelectedNarrator(
          ev.target.value === ALL_VALUE ? undefined : ev.target.value
        );
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

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div className={s.stickyHeader}>
      <div className={s.main}>
        <Link to="/" className={s.title}>
          Destiny Dialogue Archive
        </Link>

        <div className={s.subtitle}>
          {params && (
            <div className={s.specificTable}>
              <span className={s.chevron}>
                <i className="fa-regular fa-chevron-right" />
              </span>
              Table {params.tableHash}
              {params.treeHash && (
                <>
                  <span className={s.chevron}>
                    <i className="fa-regular fa-chevron-right" />
                  </span>
                  {params.treeHash}
                </>
              )}
            </div>
          )}

          <button className={s.aboutButton} onClick={openModal}>
            About
          </button>
        </div>
      </div>

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

        <div>
          <label htmlFor="narrator-select">Narrator:</label>
          <select
            id="narrator-select"
            className={s.narratorSelect}
            value={selectedNarrator}
            onChange={handleNarratorChange}
          >
            <option value={ALL_VALUE}>All</option>
            {narrators.map((narrator) => (
              <option key={narrator} value={narrator}>
                {narrator || "Unknown"}
              </option>
            ))}
          </select>
        </div>
      </div>

      <AboutModal isOpen={modalIsOpen} onRequestClose={closeModal} />
    </div>
  );
};

export default Header;
