import React, { useEffect, useState } from "react";
import Indent from "../Indent";

import s from "./styles.module.css";

interface CollapsableTableSectionProps {
  body: React.ReactNode;
  accessory: React.ReactNode;
  level: number;

  renderChildren: () => React.ReactNode;
  onToggle?: (childrenVisible: boolean) => void;
}

const CollapsableTableSection: React.FC<CollapsableTableSectionProps> = ({
  body,
  accessory,
  level,
  renderChildren,
  onToggle,
}) => {
  const [childrenIsVisible, setChildrenIsVisible] = useState(level < 3);
  const handleToggleClick = () => setChildrenIsVisible((v) => !v);

  useEffect(() => {
    onToggle?.(childrenIsVisible);
  }, [onToggle, childrenIsVisible]);

  return (
    <>
      <tr>
        <td colSpan={2}>
          <Indent level={level} />

          <span className={s.rowContent}>
            <button className="toggleButton" onClick={handleToggleClick}>
              {childrenIsVisible ? (
                <i className="far fa-chevron-down" />
              ) : (
                <i className="far fa-chevron-right" />
              )}
            </button>

            <span className="Space" />

            <span className={childrenIsVisible ? s.expanded : s.collapsed}>
              {body}
            </span>
          </span>
        </td>

        <td>{accessory}</td>
      </tr>

      {childrenIsVisible && renderChildren()}
    </>
  );
};

export default CollapsableTableSection;
