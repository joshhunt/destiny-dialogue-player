import React, { ChangeEvent, useCallback, useMemo } from "react";
import { Link } from "wouter";
import { useDialogueRoute, useReleaseDialogueRoute } from "../../lib/useRoute";
import { versions } from "../../lib/versionMap";

import { useSearchContext } from "../../views/MainView/searchContext";
import AboutModal from "../AboutModal";

import s from "./styles.module.css";

const ALL_VALUE = "$$all";

const Header = React.memo(() => {
  const [, dialougeRouteParams] = useDialogueRoute();

  const [, releaseRouteParams] = useReleaseDialogueRoute();
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

  const selectedVersion = useMemo(() => {
    if (!releaseRouteParams) return undefined;

    return Object.values(versions).find(
      (v) => v.routeName === releaseRouteParams.releaseName
    );
  }, [releaseRouteParams]);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div className={s.stickyHeader}>
      <div className={s.headerInner}>
        <div className={s.main}>
          <Link to="/" className={s.title}>
            Destiny Dialogue Archive
          </Link>

          <div className={s.subtitle}>
            {selectedVersion && (
              <div className={s.specificTable}>
                <span className={s.chevron}>
                  <i className="fa-regular fa-chevron-right" />
                </span>
                {selectedVersion.verboseName}
              </div>
            )}

            {dialougeRouteParams && (
              <div className={s.specificTable}>
                <span className={s.chevron}>
                  <i className="fa-regular fa-chevron-right" />
                </span>
                Table {dialougeRouteParams.tableHash}
                {dialougeRouteParams.treeHash && (
                  <>
                    <span className={s.chevron}>
                      <i className="fa-regular fa-chevron-right" />
                    </span>
                    {dialougeRouteParams.treeHash}
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
    </div>
  );
});

export default Header;
