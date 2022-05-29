import React, { ChangeEvent, useCallback } from "react";
import Modal from "react-modal";
import { Link } from "wouter";
import { useDialogueRoute } from "../../lib/useRoute";

import { useSearchContext } from "../../views/MainView/searchContext";
import ToggleButton, { ToggleButtonGroup } from "../Button/ToggleButton";
import IncludedDialogue from "../IncludedDialogue";

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
    gender,
    setGender,
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

  function afterOpenModal() {}

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
            </div>
          )}

          <button className={s.aboutButton} onClick={openModal}>
            About
          </button>
        </div>
      </div>

      <div className={s.extraItems}>
        <ToggleButtonGroup>
          <ToggleButton
            icon="fa-regular fa-mars"
            onClick={() => setGender("Masculine")}
            isSelected={gender === "Masculine"}
          >
            <span className={s.hideMedium}>Masculine</span>
          </ToggleButton>
          <ToggleButton
            icon="fa-regular fa-venus"
            onClick={() => setGender("Feminine")}
            isSelected={gender === "Feminine"}
          >
            <span className={s.hideMedium}>Feminine</span>
          </ToggleButton>
        </ToggleButtonGroup>

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

        <p>Destiny Dialogue Archive contains dialogue from the releases:</p>
        <IncludedDialogue />

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
