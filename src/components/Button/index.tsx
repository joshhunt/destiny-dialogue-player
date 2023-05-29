import React, { ForwardedRef, forwardRef } from "react";
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

function Button(
  { icon, children, className, ...rest }: ButtonProps,
  ref: ForwardedRef<HTMLButtonElement>
) {
  const isIconButton = icon && !children;

  return (
    <button
      ref={ref}
      {...rest}
      className={cx(className, s.button, isIconButton && s.iconButton)}
    >
      {icon && <i className={cx(icon, s.icon)} />} {children}
    </button>
  );
}

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

export default forwardRef<HTMLButtonElement, ButtonProps>(Button);

export function ButtonGroup({ children }: { children: React.ReactNode }) {
  return <div className={s.buttonGroupRoot}>{children}</div>;
}
