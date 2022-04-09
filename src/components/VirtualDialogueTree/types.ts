import { VariableSizeNodeData } from "@joshhunt/react-vtree";
import {
  DialogueBank,
  DialogueNode,
  DialogueTree,
  FilteredDialogueBank,
} from "../../types";

interface Header {
  type: "Header";
  id: "$$header";
}

export type TreeNodeData = VariableSizeNodeData &
  Readonly<{
    node: TreeNode;
    isLeaf: boolean;
    nestingLevel: number;
  }>;

export type RootDialogueCollection = DialogueBank[] | FilteredDialogueBank[];

export type TreeNode =
  | DialogueBank
  | FilteredDialogueBank
  | DialogueTree
  | DialogueNode
  | Header;

export type NodeMeta = Readonly<{
  nestingLevel: number;
  node: TreeNode;
}>;

export const USE_DEFAULT_NODE = false;

export const HEADER_NODE: Header = {
  type: "Header",
  id: "$$header",
};

export const ROW_HEIGHT = 26;

export const HEADER_ROW_HEIGHT = 47;
