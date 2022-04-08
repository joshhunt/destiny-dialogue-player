import { VariableSizeNodeData } from "@joshhunt/react-vtree";
import {
  DialogueBank,
  DialogueNode,
  DialogueTree,
  SearchResults,
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

export type VirtualizedTree = DialogueBank[] | SearchResults;

export type TreeNode =
  | DialogueBank
  | DialogueTree
  | DialogueNode
  | Header
  | SearchResults;

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
