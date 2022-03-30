import { FixedSizeNodeData } from "react-vtree";
import { DialogueBank, DialogueNode, DialogueTree } from "../../types";

export type TreeData = FixedSizeNodeData &
  Readonly<{
    node: TreeNode;
    isLeaf: boolean;
    nestingLevel: number;
  }>;

export type TreeNode = DialogueBank | DialogueTree | DialogueNode;

export type NodeMeta = Readonly<{
  nestingLevel: number;
  node: TreeNode;
}>;

export const USE_DEFAULT_NODE = false;
