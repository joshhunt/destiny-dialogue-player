import React, { useState } from "react";
import {
  useDismiss,
  useFloating,
  useClick,
  useInteractions,
  flip,
} from "@floating-ui/react";
import Button from "../Button";
import s from "./styles.module.css";
import cx from "classnames";

interface DropdownButtonProps {
  menuItems?: React.ReactNode;
}

export default function DropdownButton({ menuItems }: DropdownButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    placement: "bottom-end",
    onOpenChange: setIsOpen,
    open: isOpen,
    middleware: [flip()],
  });

  const dismiss = useDismiss(context);
  const click = useClick(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
  ]);

  return (
    <>
      <Button
        ref={refs.setReference}
        icon="fa-solid fa-caret-down"
        {...getReferenceProps()}
      />

      {isOpen && (
        <div
          className={s.menu}
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
        >
          {menuItems}
        </div>
      )}
    </>
  );
}

type MenuItemProps<T> = T & {
  children: React.ReactNode;
  icon?: string;
};

export function MenuItemButton({
  children,
  icon,
  ...rest
}: MenuItemProps<React.ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <button className={s.item} {...rest}>
      {icon && <i className={cx(icon, "fa-fw", s.icon)} />}
      {children}
    </button>
  );
}

export function MenuItemLink({
  children,
  icon,
  ...rest
}: MenuItemProps<React.AnchorHTMLAttributes<HTMLAnchorElement>>) {
  return (
    <a className={s.item} {...rest}>
      {icon && <i className={cx(icon, "fa-fw", s.icon)} />}
      {children}
    </a>
  );
}
