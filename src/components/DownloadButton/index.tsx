import { DialogueLine } from "../../types";
import cx from "classnames";
import { useMemo } from "react";
import { getMP3URL } from "../../lib/dialogueAPI";

interface Props {
  node: DialogueLine;
  className?: string;
}

const slugify = (str: string) =>
  str
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/gi, "")
    .toLowerCase()
    .trim();

const trim = (str: string) =>
  str.at(-1) === "-" ? str.slice(0, str.length - 2).trim() : str.trim();

export function DownloadButton({ node, className }: Props) {
  return (
    <a
      href={getMP3URL(node.audioFileName)}
      className={cx("actionButton", className)}
      target="_blank"
      rel="noreferrer"
    >
      <i className="fa-duotone fa-download" /> Download
    </a>
  );
}
