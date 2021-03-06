import { DialogueLine } from "../../types";
import { getMP3URL } from "../../lib/dialogueAPI";
import { Link } from "../Button";
import s from "./styles.module.css";

interface Props {
  node: DialogueLine;
  className?: string;
}

export function DownloadButton({ node, className }: Props) {
  return (
    <Link
      href={getMP3URL(node.audioFileName)}
      target="_blank"
      rel="noreferrer"
      icon="fa-duotone fa-download"
      className={className}
    >
      <span className={s.downloadText}>Download</span>
    </Link>
  );
}
