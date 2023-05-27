import React from "react";
import cx from "classnames";
import { Link as WouterLink, LinkProps as WouterLinkProps } from "wouter";

import s from "./styles.module.css";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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
    <button {...rest} className={cx(className, s.button)}>
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

export const AppLink: React.FC<WouterLinkProps & { icon?: string }> = ({
  icon,
  children,
  className,
  ...rest
}) => {
  return (
    <WouterLink {...rest} className={cx(className, s.button)}>
      {icon && <i className={cx(icon, s.icon)} />} {children}
    </WouterLink>
  );
};

export default Button;
