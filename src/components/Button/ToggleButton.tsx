import React from "react";
import cx from "classnames";
import Button, { ButtonProps } from ".";
import s from "./styles.module.css";

const ToggleButton: React.FC<ButtonProps & { isSelected: boolean }> = ({
  isSelected,
  ...props
}) => {
  return (
    <Button
      {...props}
      className={cx(s.toggleButton, isSelected && s.selected)}
    />
  );
};

export default ToggleButton;

interface ToggleButtonGroupProps {}

export const ToggleButtonGroup: React.FC<ToggleButtonGroupProps> = ({
  children,
}) => {
  return <div className={s.buttonGroup}>{children}</div>;
};
