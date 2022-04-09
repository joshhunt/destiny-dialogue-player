import React, { ChangeEvent, useCallback } from "react";
import Modal from "react-modal";

import { useSearchContext } from "../../views/MainView/searchContext";

import s from "./styles.module.css";

interface HeaderProps {
  hideControls?: boolean;
}

const Header: React.FC<HeaderProps> = ({ hideControls }) => {
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

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {}

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div className={s.stickyHeader}>
      <div className={s.main}>
        <div className={s.title}>Destiny Dialgoue Archive</div>
        <button className={s.aboutButton} onClick={openModal}>
          About
        </button>
      </div>

      {!hideControls && narrators.length > 0 && (
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
              <option>All</option>
              {narrators.map((narrator) => (
                <option key={narrator} value={narrator}>
                  {narrator || "Unknown"}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        overlayClassName={s.modalOverlay}
        portalClassName={s.modalRoot}
        className={s.modal}
      >
        <h2 className={s.modalTitle}>Hello, world :) </h2>

        <p className={s.desc}>
          Destiny Dialogue Archive is a fan-made archive of Destiny's dialogue
          from multiple versions. The intent for this site is to archive
          dialogue as it is removed from the game, not to "datamine" or share
          spoilers. Minimal effort has been put into keeping spoilers off the
          site, but read at your own risk.
        </p>

        <p className={s.desc}>
          Currently, it contains dialogue just from Destiny 3.4.0.4 - just
          before Witch Queen. Other versions (past and future) will be added
          later.
        </p>

        <p className={s.desc}>
          Many thanks to montague, ginsor, Phillip, and all the others who have
          helped on this project.
        </p>

        <p className={s.altDesc}>
          Note: for technical reasons, the narrator sometimes might be missing,
          or incorrect. If you have knowledge of Destiny's dialogue tables, feel
          free to DM me and help out :)
        </p>

        <p className={s.desc}>
          <a href="https://twitter.com/joshhunt">@joshhunt</a>
        </p>

        <button className={s.closeButton} onClick={closeModal}>
          <span className={s.stopIcon}>
            <i className="fa-regular fa-xmark"></i>
          </span>
          Close
        </button>
      </Modal>
    </div>
  );
};

export default Header;
