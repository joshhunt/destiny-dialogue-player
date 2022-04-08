import { TreeWalker, TreeWalkerValue } from "@joshhunt/react-vtree";
import { useMemo } from "react";

import {
  HEADER_NODE,
  NodeMeta,
  TreeNodeData,
  TreeNode,
  VirtualizedTree,
  HEADER_ROW_HEIGHT,
  ROW_HEIGHT,
} from "./types";

const getNodeData = (
  node: TreeNode,
  nestingLevel: number
): TreeWalkerValue<TreeNodeData, NodeMeta> => ({
  data: {
    id: node.id,
    isLeaf: "type" in node && node.type === "DialogueLine",
    isOpenByDefault: nestingLevel < 3,
    nestingLevel,
    node,
    defaultHeight:
      "type" in node && node.type === "Header" ? HEADER_ROW_HEIGHT : ROW_HEIGHT,
  },
  nestingLevel,
  node,
});

function makeTreeWalker(dialogueBanks: VirtualizedTree) {
  function* treeWalker(): ReturnType<TreeWalker<TreeNodeData, NodeMeta>> {
    yield getNodeData(HEADER_NODE, 0);

    if ("type" in dialogueBanks) {
      yield getNodeData(dialogueBanks, 0);
    } else {
      for (let i = 0; i < dialogueBanks.length; i++) {
        yield getNodeData(dialogueBanks[i], 0);
      }
    }

    while (true) {
      const parentMeta = yield;
      const parentNode = parentMeta.node;
      let handled = false;

      // It's a DialogueBank
      if (!("type" in parentNode)) {
        handled = true;
        const dialogueBank = parentNode;

        for (let index = 0; index < dialogueBank.dialogues.length; index++) {
          const dialogueTree = dialogueBank.dialogues[index];

          yield getNodeData(dialogueTree, parentMeta.nestingLevel + 1);
        }
      }

      // Custom header node, doesnt yield any children
      if ("type" in parentNode && parentNode.type === "Header") {
        handled = true;
      }

      // Custom search results node
      if ("type" in parentNode && parentNode.type === "SearchResults") {
        handled = true;
        const searchResults = parentNode;
        for (const childNode of searchResults.results) {
          yield getNodeData(childNode, parentMeta.nestingLevel + 1);
        }
      }

      // It's a DialogueTree
      if ("type" in parentNode && parentNode.type === "DialogueTree") {
        handled = true;
        const dialogueTree = parentNode;
        yield getNodeData(dialogueTree.dialogue, parentMeta.nestingLevel + 1);
      }

      // It's a DialogueSequence
      if ("type" in parentNode && parentNode.type === "DialogueSequence") {
        handled = true;
        const dialogueSequence = parentNode;

        for (const childNode of dialogueSequence.sequence) {
          yield getNodeData(childNode, parentMeta.nestingLevel + 1);
        }
      }

      // It's a DialogueBranch
      if ("type" in parentNode && parentNode.type === "DialogueBranch") {
        handled = true;
        const dialogueBranch = parentNode;

        for (const childNode of dialogueBranch.options) {
          yield getNodeData(childNode, parentMeta.nestingLevel + 1);
        }
      }

      // It's a DialogueLine
      if ("type" in parentNode && parentNode.type === "DialogueLine") {
        handled = true;
        // We don't need to yield anything for DialogueLines
      }

      if (!handled) {
        throw new Error("Unhandled type " + (parentNode as any).type);
      }
    }
  }

  return treeWalker;
}

export default function useTreeWalker(dialogueBanks: VirtualizedTree) {
  const treeWalker = useMemo(
    () => makeTreeWalker(dialogueBanks),
    [dialogueBanks]
  );

  return treeWalker;
}
