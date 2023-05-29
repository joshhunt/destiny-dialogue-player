import { DialogueLine } from "../../types";
import { getMP3URL } from "../../lib/dialogueAPI";
import { Link } from "../Button";
import { TreeNode } from "../VirtualDialogueTree/types";
import { useMemo } from "react";

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
      Download
    </Link>
  );
}

export function useDownloadProps(node: TreeNode) {
  return useMemo(() => {
    if (node.type !== "DialogueLine") return {};

    const name =
      slugify(`${node.narrator}-${node.caption}`).slice(0, 40) +
      "-" +
      node.audioFileName;

    return {
      href: getMP3URL(node.audioFileName),
      target: "_blank",
      rel: "noreferrer",
      download: name,
    };
  }, [node]);
}

const slugify = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
