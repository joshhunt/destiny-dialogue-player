import React from "react";
import cx from "classnames";

import s from "./styles.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: string;
}

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  icon?: string;
}

const Button: React.FC<ButtonProps> = ({
  icon,
  children,
  className,
  ...rest
}) => {
  return (
    <button {...rest} className={cx(className, s.button, icon && s.withIcon)}>
      {icon && <i className={cx(icon, s.icon)} />} {children}
    </button>
  );
};

export const Link: React.FC<LinkProps> = ({
  icon,
  children,
  className,
  ...rest
}) => {
  return (
    <a {...rest} className={cx(className, s.button)}>
      {icon && <i className={cx(icon, s.icon)} />} {children}
    </a>
  );
};

export default Button;
