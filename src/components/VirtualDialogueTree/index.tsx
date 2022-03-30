import React, { useState } from "react";
import { DialogueBank } from "../../types";
import AutoSizer from "react-virtualized-auto-sizer";

import { FixedSizeTree, TreeWalker, TreeWalkerValue } from "react-vtree";
import { NodeMeta, TreeData, TreeNode } from "./types";
import Node from "./Node";

const getNodeData = (
  node: TreeNode,
  nestingLevel: number
): TreeWalkerValue<TreeData, NodeMeta> => ({
  data: {
    id: node.id,
    isLeaf: "type" in node && node.type === "DialogueLine",
    isOpenByDefault: nestingLevel < 3,
    nestingLevel,
    node,
  },
  nestingLevel,
  node,
});

const USE_DEFAULT_NODE = false;

interface VirtualDialogueTreeProps {
  dialogueBanks: DialogueBank[];
}

function makeTreeWalker(dialogueBanks: DialogueBank[]) {
  function* treeWalker(): ReturnType<TreeWalker<TreeData, NodeMeta>> {
    for (let i = 0; i < dialogueBanks.length; i++) {
      yield getNodeData(dialogueBanks[i], 0);
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

function useTreeWalker(dialogueBanks: DialogueBank[]) {
  const [treeWalker] = useState(() => makeTreeWalker(dialogueBanks));

  return treeWalker;
}

const VirtualDialogueTree: React.FC<VirtualDialogueTreeProps> = ({
  dialogueBanks,
}) => {
  const treeWalker = useTreeWalker(dialogueBanks);

  const itemSize = USE_DEFAULT_NODE ? 30 : 26;
  return (
    <AutoSizer disableWidth>
      {({ height }) => (
        <FixedSizeTree
          treeWalker={treeWalker}
          itemSize={itemSize}
          height={height}
          width="100%"
        >
          {Node}
        </FixedSizeTree>
      )}
    </AutoSizer>
  );
};

export default VirtualDialogueTree;
