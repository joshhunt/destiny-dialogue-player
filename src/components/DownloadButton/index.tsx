import { DialogueLine } from "../../types";
import cx from "classnames";
import { getMP3URL } from "../../lib/dialogueAPI";

interface Props {
  node: DialogueLine;
  className?: string;
}

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
