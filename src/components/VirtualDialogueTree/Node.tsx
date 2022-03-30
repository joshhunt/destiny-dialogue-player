import { FixedSizeNodePublicState } from "react-vtree";
import { NodeComponentProps } from "react-vtree/dist/es/Tree";
import cx from "classnames";

import Indent from "../Indent";
import DisclosureButton from "../DisclosureButton";
import { formattedSummary } from "../../lib/utils";

import s from "./styles.module.css";
import { TreeData, USE_DEFAULT_NODE } from "./types";
import { PlayButton } from "../PlayButton";

function hashCode(str: string) {
  let hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  return hash;
}

function clampHue(hue: number) {
  return hue % 360;
}

function pickColor(str: string) {
  return `hsl(${clampHue(hashCode(str))}, 100%, 80%)`;
}

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
      <div className={cx(s.row, s.faintRow)} style={style}>
        <div className={s.rowMain}>
          <Indent level={nestingLevel} />
          <DisclosureButton isOpen={isOpen} onClick={() => setOpen(!isOpen)} />
          <span className="Space" />
          Dialogue File {node.entryKey} / {node.contentHash}
        </div>
      </div>
    );
  }

  if (node.type === "DialogueTree") {
    return (
      <div className={cx(s.row, s.faintRow)} style={style}>
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
      <div className={cx(s.row, s.faintRow)} style={style}>
        <div className={s.rowMain}>
          <Indent level={nestingLevel} />
          <DisclosureButton isOpen={isOpen} onClick={() => setOpen(!isOpen)} />
          <span className="Space" />
          {isOpen ? "Sequence" : summary}
        </div>

        <div className={s.accessory}>
          <PlayButton node={node} />
        </div>
      </div>
    );
  }

  if (node.type === "DialogueBranch") {
    const summary = formattedSummary(node.options);
    return (
      <div className={cx(s.row, s.faintRow)} style={style}>
        <div className={s.rowMain}>
          <Indent level={nestingLevel} />
          <DisclosureButton isOpen={isOpen} onClick={() => setOpen(!isOpen)} />
          <span className="Space" />
          {isOpen ? "Options" : summary}
        </div>

        <div className={s.accessory}>
          <PlayButton node={node} />
        </div>
      </div>
    );
  }

  if (node.type === "DialogueLine") {
    return (
      <div className={cx(s.row)} style={style}>
        <div className={s.rowMain}>
          <Indent level={nestingLevel} />
          <span className="toggleButtonSpacer" />
          <span
            className={s.narrator}
            style={{
              color: node.narrator ? pickColor(node.narrator) : "",
            }}
          >
            {node.narrator || <em>Unknown</em>}:
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
