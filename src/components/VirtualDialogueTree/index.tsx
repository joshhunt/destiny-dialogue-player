import React, { forwardRef, useCallback, useMemo } from "react";
import { DialogueBank, DialogueLine, SearchResults } from "../../types";
import AutoSizer from "react-virtualized-auto-sizer";
import { Scrollbars } from "react-custom-scrollbars";

import {
  VariableSizeTree,
  TreeWalker,
  TreeWalkerValue,
} from "@joshhunt/react-vtree";
import { HEADER_NODE, NodeMeta, TreeData, TreeNode } from "./types";
import Node from "./Node";

import s from "./styles.module.css";
import Header from "../Header";

const ROW_HEIGHT = 26;
const HEADER_ROW_HEIGHT = 47;

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
    defaultHeight:
      "type" in node && node.type === "Header" ? HEADER_ROW_HEIGHT : ROW_HEIGHT,
  },
  nestingLevel,
  node,
});

interface VirtualDialogueTreeProps {
  dialogueBanks: DialogueBank[] | DialogueLine[] | SearchResults;
}

function makeTreeWalker(
  dialogueBanks: DialogueBank[] | DialogueLine[] | SearchResults
) {
  function* treeWalker(): ReturnType<TreeWalker<TreeData, NodeMeta>> {
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

function useTreeWalker(
  dialogueBanks: DialogueBank[] | DialogueLine[] | SearchResults
) {
  const treeWalker = useMemo(
    () => makeTreeWalker(dialogueBanks),
    [dialogueBanks]
  );

  return treeWalker;
}

function getScrollbarWidth() {
  const outer = document.createElement("div");
  outer.style.visibility = "hidden";
  outer.style.width = "100px";
  document.body.appendChild(outer);

  const widthNoScroll = outer.offsetWidth;
  outer.style.overflow = "scroll";

  const inner = document.createElement("div");
  inner.style.width = "100%";
  outer.appendChild(inner);

  const widthWithScroll = inner.offsetWidth;
  outer.parentNode?.removeChild(outer);

  return widthNoScroll - widthWithScroll;
}

console.log("getScrollbarWidth:", getScrollbarWidth());

const outerElementType = forwardRef<HTMLDivElement, any>(
  ({ style, ...rest }, ref) => {
    const renderThumb = useCallback(({ style, ...props }) => {
      return <div className={s.scrollerThumb} style={style} {...props} />;
    }, []);

    const renderTrack = useCallback(({ style, ...props }) => {
      return <div className={s.scrollerTrack} style={style} {...props} />;
    }, []);

    return (
      <Scrollbars
        ref={ref}
        style={{ ...style, overflow: "hidden" }}
        className={s.scrollRoot}
        autoHide
        renderThumbVertical={renderThumb}
        renderTrackVertical={renderTrack}
        {...rest}
      />
    );
  }
);

const innerElementType = forwardRef<HTMLDivElement>(
  ({ children, ...rest }, ref) => {
    return (
      <div ref={ref} {...rest}>
        <Header />

        {children}
      </div>
    );
  }
);

const VirtualDialogueTree: React.FC<VirtualDialogueTreeProps> = ({
  dialogueBanks,
}) => {
  const treeWalker = useTreeWalker(dialogueBanks);

  return (
    <AutoSizer disableWidth>
      {({ height }) => (
        <VariableSizeTree
          treeWalker={treeWalker}
          itemSize={(index: any) =>
            index === 0 ? HEADER_ROW_HEIGHT : ROW_HEIGHT
          }
          height={height}
          width="100%"
          outerElementType={outerElementType}
          innerElementType={innerElementType}
        >
          {Node}
        </VariableSizeTree>
      )}
    </AutoSizer>
  );
};

export default VirtualDialogueTree;
