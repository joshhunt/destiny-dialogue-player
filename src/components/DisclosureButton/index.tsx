import React from "react";

interface DisclosureButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const DisclosureButton: React.FC<DisclosureButtonProps> = ({
  isOpen,
  onClick,
}) => {
  return (
    <button className="toggleButton" onClick={onClick}>
      {isOpen ? (
        <i className="fa-regular fa-chevron-down" />
      ) : (
        <i className="fa-regular fa-chevron-right" />
      )}
    </button>
  );
};

export default DisclosureButton;
