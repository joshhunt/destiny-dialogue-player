import { TreeWalker, TreeWalkerValue } from "@joshhunt/react-vtree";
import { useMemo } from "react";
import { getNodeState } from "../../lib/sessionStorage";
import { Gender } from "../../types";

import {
  HEADER_NODE,
  NodeMeta,
  TreeNodeData,
  TreeNode,
  RootDialogueCollection,
  HEADER_ROW_HEIGHT,
  ROW_HEIGHT,
} from "./types";

const getNodeData = (
  _node: TreeNode,
  nestingLevel: number,
  gender: Gender
): TreeWalkerValue<TreeNodeData, NodeMeta> => {
  let node: TreeNode;

  if (_node.type === "DialogueBranch" && _node.hasGenderedOptions) {
    node =
      _node.options.find(
        (v) => v.type === "DialogueLine" && v.gender === gender
      ) ?? _node.options[0];
  } else {
    node = _node;
  }

  const nodeId = typeof node.id === "number" ? node.id.toString() : node.id;
  const previousNodeOpenState = getNodeState(nodeId);

  const data = {
    data: {
      id: nodeId,
      isLeaf: "type" in node && node.type === "DialogueLine",
      isOpenByDefault: previousNodeOpenState || nestingLevel < 3,
      //isOpenByDefault: false,
      nestingLevel,
      node,
      defaultHeight:
        "type" in node && node.type === "Header"
          ? HEADER_ROW_HEIGHT
          : ROW_HEIGHT,
    },
    nestingLevel,
    node,
  };

  return data;
};

function makeTreeWalker(dialogueBanks: RootDialogueCollection, gender: Gender) {
  function* treeWalker(): ReturnType<TreeWalker<TreeNodeData, NodeMeta>> {
    yield getNodeData(HEADER_NODE, 0, gender);

    if ("type" in dialogueBanks) {
      yield getNodeData(dialogueBanks, 0, gender);
    } else {
      for (let i = 0; i < dialogueBanks.length; i++) {
        yield getNodeData(dialogueBanks[i], 0, gender);
      }
    }

    while (true) {
      const parentMeta = yield;
      const parentNode = parentMeta.node;
      let handled = false;

      // It's a DialogueBank
      if (parentNode.type === "ArchivedDialogueTable") {
        handled = true;
        const dialogueBank = parentNode;

        for (let index = 0; index < dialogueBank.dialogues.length; index++) {
          const dialogueTree = dialogueBank.dialogues[index];

          yield getNodeData(dialogueTree, parentMeta.nestingLevel + 1, gender);
        }
      }

      // Custom header node, doesnt yield any children
      if (parentNode.type === "Header") {
        handled = true;
      }

      // Custom search results node
      if (parentNode.type === "FilteredDialogueTable") {
        handled = true;
        const dialogueBank = parentNode;
        for (const childNode of dialogueBank.lines) {
          yield getNodeData(childNode, parentMeta.nestingLevel + 1, gender);
        }
      }

      // It's a DialogueTree
      if (parentNode.type === "ArchivedDialogueTree") {
        handled = true;
        const dialogueTree = parentNode;
        yield getNodeData(
          dialogueTree.dialogue,
          parentMeta.nestingLevel + 1,
          gender
        );
      }

      // It's a DialogueSequence
      if (parentNode.type === "DialogueSequence") {
        handled = true;
        const dialogueSequence = parentNode;

        for (const childNode of dialogueSequence.sequence) {
          yield getNodeData(childNode, parentMeta.nestingLevel + 1, gender);
        }
      }

      // It's a DialogueBranch
      if (parentNode.type === "DialogueBranch") {
        handled = true;
        const dialogueBranch = parentNode;

        // if (dialogueBranch.hasGenderedOptions) {
        //   yield getNodeData(
        //     dialogueBranch.options[0],
        //     parentMeta.nestingLevel + 1
        //   );
        // } else {
        for (const childNode of dialogueBranch.options) {
          yield getNodeData(childNode, parentMeta.nestingLevel + 1, gender);
        }
        // }
      }

      // It's a DialogueLine
      if (parentNode.type === "DialogueLine") {
        handled = true;
        // We don't need to yield anything for DialogueLines becasue they don't have children
      }

      if (!handled) {
        throw new Error("Unhandled type " + (parentNode as any).type);
      }
    }
  }

  return treeWalker;
}

export default function useTreeWalker(
  dialogueBanks: RootDialogueCollection,
  gender: Gender
) {
  const treeWalker = useMemo(
    () => makeTreeWalker(dialogueBanks, gender),
    [dialogueBanks, gender]
  );

  return treeWalker;
}
