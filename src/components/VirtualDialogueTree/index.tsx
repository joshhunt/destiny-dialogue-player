import React, { forwardRef, useCallback, useRef } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { Scrollbars } from "react-custom-scrollbars";

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
  const treeRef = useRef<VariableSizeTree<TreeNodeData> | null>();
  const treeWalker = useTreeWalker(dialogueBanks);
  const { setSelectedNarrator, setSearchText } = useSearchContext();

  const goTo = useCallback(
    (node: AnyDialogueStructure, id: string) => {
      console.log("go to", { id, node });
      setSelectedNarrator(undefined);
      setSearchText(undefined);

      setTimeout(() => {
        if (treeRef.current) {
          // const id = typeof node.id === "number" ? node.id.toString() : node.id;
          console.log("trying to scroll to", id);
          treeRef.current.scrollToItem(id, "center");
        }
      }, 1000);
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
          >
            {Node}
          </VariableSizeTree>
        )}
      </AutoSizer>
    </GoToProvider>
  );
};

export default VirtualDialogueTree;
