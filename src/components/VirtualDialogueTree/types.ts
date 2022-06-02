import { VariableSizeNodeData } from "@joshhunt/react-vtree";
import {
  DialogueTable,
  FilteredDialogueTable,
  AnyDialogueStructure,
} from "../../types";

interface Header {
  type: "Header";
  id: "$$header";
}

export type TreeNodeData = VariableSizeNodeData &
  Readonly<{
    node: TreeNode;
    parent: TreeNode | null;
    isLeaf: boolean;
    nestingLevel: number;
  }>;

export type RootDialogueCollection = DialogueTable[] | FilteredDialogueTable[];

export type TreeNode = AnyDialogueStructure | Header;

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
export const SMALL_HEADER_ROW_HEIGHT = 53;
