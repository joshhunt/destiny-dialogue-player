import React, { forwardRef, useCallback } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { Scrollbars } from "react-custom-scrollbars";

import { VariableSizeTree } from "@joshhunt/react-vtree";
import { HEADER_ROW_HEIGHT, ROW_HEIGHT, VirtualizedTree } from "./types";
import Node from "./Node";

import s from "./styles.module.css";
import Header from "../Header";
import useTreeWalker from "./useTreeWalker";

interface VirtualDialogueTreeProps {
  dialogueBanks: VirtualizedTree;
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
