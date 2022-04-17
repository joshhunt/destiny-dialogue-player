import { FixedSizeNodePublicState } from "@joshhunt/react-vtree";
import { NodeComponentProps } from "@joshhunt/react-vtree/dist/es/Tree";
import cx from "classnames";

import Indent from "../Indent";
import DisclosureButton from "../DisclosureButton";
import { formattedSummary } from "../../lib/utils";

import s from "./styles.module.css";
import { TreeNodeData, USE_DEFAULT_NODE } from "./types";
import { PlayButton } from "../PlayButton";
import { pickColor } from "../../lib/color";

const Node: React.FC<
  NodeComponentProps<TreeNodeData, FixedSizeNodePublicState<TreeNodeData>>
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
            <button type="button" onClick={() => setOpen(!isOpen)}>
              {isOpen ? "-" : "+"}
            </button>
          </div>
        )}
        <div>{id}</div>
      </div>
    );
  }

  if (!("type" in node)) {
    // DialogueBank
    return (
      <div
        className={cx(s.row, s.bank, index % 2 && s.alternateRow)}
        style={style}
      >
        <div className={s.rowMain} key="file">
          <Indent level={nestingLevel} />
          <DisclosureButton isOpen={isOpen} onClick={() => setOpen(!isOpen)} />
          <span className="Space" />
          <i className="fa-duotone fa-file"></i>
          <span className="Space" />
          Dialogue File {node.entryKey.replace(/0x/g, "")}
          <span className="Space" />/<span className="Space" />
          {node.contentHash}
          {node.contentPath && (
            <>
              <span className="Space" />
              <span className={s.selectBoundry}> </span>
              <span className={s.faint}>{node.contentPath}</span>
              <span className={s.selectBoundry}> </span>
            </>
          )}
        </div>
      </div>
    );
  }

  // We don't render the header here, it's rendered separately
  if (node.type === "Header") {
    return null;
  }

  if (node.type === "FilteredDialogueBank") {
    // DialogueBank
    return (
      <div
        className={cx(s.row, s.bank, index % 2 && s.alternateRow)}
        style={style}
      >
        <div className={s.rowMain} key="glass">
          <Indent level={nestingLevel} />
          <DisclosureButton isOpen={isOpen} onClick={() => setOpen(!isOpen)} />
          <span className="Space" />
          <i className="fa-duotone fa-file-magnifying-glass"></i>
          <span className="Space" />
          Dialogue File {node.entryKey} / {node.contentHash}
        </div>
      </div>
    );
  }

  if (node.type === "DialogueTree") {
    return (
      <div
        className={cx(s.row, s.faint, index % 2 && s.alternateRow)}
        style={style}
      >
        <div className={s.rowMain}>
          <Indent level={nestingLevel} />
          <DisclosureButton isOpen={isOpen} onClick={() => setOpen(!isOpen)} />
          <span className="Space" />
          Dialogue Tree {node.contentHash}
        </div>
      </div>
    );
  }

  if (node.type === "DialogueSequence") {
    const summary = formattedSummary(node.sequence);
    return (
      <div
        className={cx(s.row, s.faint, index % 2 && s.alternateRow)}
        style={style}
      >
        <div className={s.rowMain}>
          <Indent level={nestingLevel} />
          <DisclosureButton isOpen={isOpen} onClick={() => setOpen(!isOpen)} />
          <span className="Space" />
          {isOpen ? "Sequence" : summary}
        </div>

        <div className={s.accessory}>
          <PlayButton node={node} label="Play all" />
        </div>
      </div>
    );
  }

  if (node.type === "DialogueBranch") {
    const summary = formattedSummary(node.options);
    return (
      <div
        className={cx(s.row, s.faint, index % 2 && s.alternateRow)}
        style={style}
      >
        <div className={s.rowMain}>
          <Indent level={nestingLevel} />
          <DisclosureButton isOpen={isOpen} onClick={() => setOpen(!isOpen)} />
          <span className="Space" />
          {isOpen ? "Options" : summary}
        </div>

        <div className={s.accessory}>
          <PlayButton node={node} label="Play All" playAllBranches />
          <span className="Space" />
          <PlayButton node={node} label="Branch" />
        </div>
      </div>
    );
  }

  if (node.type === "DialogueLine") {
    const narrator = node.narrator?.trim();

    return (
      <div className={cx(s.row, index % 2 && s.alternateRow)} style={style}>
        <div className={s.rowMain}>
          <Indent level={nestingLevel} />
          <span className="toggleButtonSpacer" />
          <span
            className={s.narrator}
            style={{
              color: narrator ? pickColor(node.narrator) : "",
            }}
          >
            {narrator || <em>Unknown</em>}:
          </span>{" "}
          {node.caption}
        </div>{" "}
        <div className={s.accessory}>
          <PlayButton node={node} />
        </div>
      </div>
    );
  }

  return <div style={style}>Unhandled node type</div>;
};

export default Node;
