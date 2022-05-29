import React, { forwardRef, useCallback, useRef } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import cx from "classnames";

import { VariableSizeTree } from "@joshhunt/react-vtree";
import {
  HEADER_ROW_HEIGHT,
  ROW_HEIGHT,
  RootDialogueCollection,
  TreeNodeData,
} from "./types";
import Node from "./Node";

import s from "./styles.module.css";
import Header from "../Header";
import useTreeWalker from "./useTreeWalker";
import { GoToProvider } from "./useGoToNode";
import { useSearchContext } from "../../views/MainView/searchContext";
import { AnyDialogueStructure } from "../../types";

interface VirtualDialogueTreeProps {
  dialogueBanks: RootDialogueCollection;
}

const outerElementType = forwardRef<HTMLDivElement, any>(
  ({ style, className, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        style={style}
        className={cx(className, s.cssScrollBars)}
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
  const treeRef = useRef<VariableSizeTree<TreeNodeData> | null>();
  const { setSelectedNarrator, setSearchText, gender } = useSearchContext();
  const treeWalker = useTreeWalker(dialogueBanks, gender);

  (window as any).treeRef = treeRef;

  const goTo = useCallback(
    (node: AnyDialogueStructure, id: string) => {
      setSelectedNarrator(undefined);
      setSearchText(undefined);

      setTimeout(() => {
        if (treeRef.current) {
          const itemIndex = treeRef.current.state.order?.indexOf(id) ?? -1;
          if (itemIndex > -1) {
            treeRef.current.scrollTo((itemIndex - 1) * ROW_HEIGHT);
          } else {
            treeRef.current.scrollToItem(id, "start");
          }
        }
      }, 1);
    },
    [setSelectedNarrator, setSearchText]
  );

  return (
    <GoToProvider value={goTo}>
      <AutoSizer disableWidth>
        {({ height }) => (
          <VariableSizeTree
            ref={(r) => (treeRef.current = r)}
            treeWalker={treeWalker}
            itemSize={(index: any) =>
              index === 0 ? HEADER_ROW_HEIGHT : ROW_HEIGHT
            }
            height={height}
            width="100%"
            outerElementType={outerElementType}
            innerElementType={innerElementType}
            overscanCount={50}
          >
            {Node}
          </VariableSizeTree>
        )}
      </AutoSizer>
    </GoToProvider>
  );
};

export default VirtualDialogueTree;
