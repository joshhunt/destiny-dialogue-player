import React, { useState } from "react";
import { DialogueBank, DialogueNode, DialogueTree } from "../../types";
import AutoSizer from "react-virtualized-auto-sizer";
import cx from "classnames";

import {
  FixedSizeNodeData,
  FixedSizeNodePublicState,
  FixedSizeTree,
  TreeWalker,
  TreeWalkerValue,
} from "react-vtree";

import { NodeComponentProps } from "react-vtree/dist/es/Tree";
import Indent from "../Indent";
import DisclosureButton from "../DisclosureButton";
import { formattedSummary } from "../../lib/utils";

import s from "./styles.module.css";

type TreeData = FixedSizeNodeData &
  Readonly<{
    node: TreeNode;
    isLeaf: boolean;
    nestingLevel: number;
  }>;

const DEFAULT_TEXT_STYLE = { marginLeft: 10 };
const DEFAULT_BUTTON_STYLE = { fontFamily: "Courier New" };

type TreeNode = DialogueBank | DialogueTree | DialogueNode;

type NodeMeta = Readonly<{
  nestingLevel: number;
  node: TreeNode;
}>;

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

const Node: React.FC<
  NodeComponentProps<TreeData, FixedSizeNodePublicState<TreeData>>
> = ({
  data: { node, isLeaf, id, nestingLevel },
  index,
  isOpen,
  style,
  setOpen,
}) => {
  if (USE_DEFAULT_NODE) {
    return (
      <div
        style={{
          ...style,
          alignItems: "center",
          display: "flex",
          marginLeft: nestingLevel * 30 + (isLeaf ? 24 : 0),
        }}
      >
        {!isLeaf && (
          <div>
            <button
              type="button"
              onClick={() => setOpen(!isOpen)}
              style={DEFAULT_BUTTON_STYLE}
            >
              {isOpen ? "-" : "+"}
            </button>
          </div>
        )}
        <div style={DEFAULT_TEXT_STYLE}>{id}</div>
      </div>
    );
  }

  if (!("type" in node)) {
    // DialogueBank
    return (
      <div className={cx(s.row, s.faintRow)} style={style}>
        <Indent level={nestingLevel} />
        <DisclosureButton isOpen={isOpen} onClick={() => setOpen(!isOpen)} />
        <span className="Space" />
        Dialogue File {node.entryKey} / {node.contentHash}
      </div>
    );
  }

  if (node.type === "DialogueTree") {
    return (
      <div className={cx(s.row, s.faintRow)} style={style}>
        <Indent level={nestingLevel} />
        <DisclosureButton isOpen={isOpen} onClick={() => setOpen(!isOpen)} />
        <span className="Space" />
        Dialogue Tree {node.contentHash}
      </div>
    );
  }

  if (node.type === "DialogueSequence") {
    const summary = formattedSummary(node.sequence);
    return (
      <div className={cx(s.row, s.faintRow)} style={style}>
        <Indent level={nestingLevel} />
        <DisclosureButton isOpen={isOpen} onClick={() => setOpen(!isOpen)} />
        <span className="Space" />
        {isOpen ? "Sequence" : summary}
      </div>
    );
  }

  if (node.type === "DialogueBranch") {
    const summary = formattedSummary(node.options);
    return (
      <div className={cx(s.row, s.faintRow)} style={style}>
        <Indent level={nestingLevel} />
        <DisclosureButton isOpen={isOpen} onClick={() => setOpen(!isOpen)} />
        <span className="Space" />
        {isOpen ? "Options" : summary}
      </div>
    );
  }

  if (node.type === "DialogueLine") {
    return (
      <div data-index={index} className={cx(s.row)} style={style}>
        <Indent level={nestingLevel} />
        <span className="toggleButtonSpacer" />
        <span className={s.narrator}>
          {node.narrator || <em>Unknown</em>}:
        </span>{" "}
        {node.caption}
      </div>
    );
  }

  return <div style={style}>Unhandled node type</div>;
};

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
