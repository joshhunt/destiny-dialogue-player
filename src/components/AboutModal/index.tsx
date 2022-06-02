import React from "react";
import Modal from "react-modal";
import { useSearchContext } from "../../views/MainView/searchContext";
import ToggleButton, { ToggleButtonGroup } from "../Button/ToggleButton";
import IncludedDialogue from "../IncludedDialogue";

import s from "./styles.module.css";

interface AboutModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onRequestClose }) => {
  const { gender, setGender } = useSearchContext();

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayClassName={s.modalOverlay}
      portalClassName={s.modalRoot}
      className={s.modal}
    >
      <h2 className={s.modalTitle}>Hello, world :) </h2>

      <p className={s.desc}>
        Destiny Dialogue Archive is a fan-made archive of Destiny's dialogue
        from multiple versions. The intent for this site is to archive dialogue
        as it is removed from the game, not to "datamine" or share spoilers.
        Minimal effort has been put into keeping spoilers off the site, but read
        at your own risk.
      </p>

      <p>Destiny Dialogue Archive contains dialogue from the releases:</p>
      <IncludedDialogue />

      <p className={s.desc}>
        Many thanks to montague, ginsor, Phillip, and all the others who have
        helped on this project.
      </p>

      <p className={s.desc}>
        <a href="https://twitter.com/joshhunt">@joshhunt</a>
      </p>

      <p className={s.altDesc}>
        Some dialogue is gendered (for example, Drifter calling you{" "}
        <em>brother</em> or <em>sister</em>. Select the gender for this gender:
      </p>

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

      <br />

      <button className={s.closeButton} onClick={onRequestClose}>
        <span className={s.stopIcon}>
          <i className="fa-regular fa-xmark"></i>
        </span>
        Close
      </button>
    </Modal>
  );
};

export default AboutModal;
