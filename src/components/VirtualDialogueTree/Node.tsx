import { FixedSizeNodePublicState } from "@joshhunt/react-vtree";
import { NodeComponentProps } from "@joshhunt/react-vtree/dist/es/Tree";
import cx from "classnames";

import Indent from "../Indent";
import DisclosureButton from "../DisclosureButton";
import { formattedSummary } from "../../lib/utils";

import s from "./styles.module.css";
import { TreeNodeData } from "./types";
import { PlayButton } from "../PlayButton";
import { pickColor } from "../../lib/color";
import DialogueBankNode from "./DialogueBankNode";
import { DownloadButton } from "../DownloadButton";
import { getVersionName } from "../../lib/versionMap";
import { useCallback } from "react";
import { saveNodeState } from "../../lib/sessionStorage";
import { Link } from "wouter";

const Node: React.FC<
  NodeComponentProps<TreeNodeData, FixedSizeNodePublicState<TreeNodeData>>
> = ({
  data: { node, parent, id, nestingLevel },
  index,
  isOpen,
  style,
  setOpen,
}) => {
  const toggleOpen = useCallback(() => {
    const newOpenness = !isOpen;
    saveNodeState(id, newOpenness);
    setOpen(newOpenness);
  }, [id, isOpen, setOpen]);

  // We don't render the header here, it's rendered separately
  if (node.type === "Header") {
    return null;
  }

  if (node.type === "ArchivedDialogueTable") {
    return (
      <div
        className={cx(s.row, s.bank, index % 2 && s.alternateRow)}
        style={style}
      >
        <div className={s.rowMain} key="file">
          <Indent level={nestingLevel} />
          <DisclosureButton isOpen={isOpen} onClick={toggleOpen} />
          <DialogueBankNode node={node} id={id} />
        </div>

        <div className={s.rowAccessory}>
          <Link to={`/d/${node.hash}`} className={s.permalink}>
            Permalink
          </Link>
        </div>
      </div>
    );
  }

  if (node.type === "FilteredDialogueTable") {
    return (
      <div
        className={cx(s.row, s.bank, index % 2 && s.alternateRow)}
        style={style}
      >
        <div className={s.rowMain} key="glass">
          <Indent level={nestingLevel} />
          <DisclosureButton isOpen={isOpen} onClick={toggleOpen} />
          <DialogueBankNode node={node} id={id} />
        </div>

        <div className={s.rowAccessory}>
          <Link to={`/d/${node.hash}`} className={s.permalink}>
            Permalink
          </Link>
        </div>
      </div>
    );
  }

  if (node.type === "ArchivedDialogueTree") {
    const firstVersion = node.versions.at(0) ?? "";
    const lastVersion = node.versions.at(-1) ?? "";

    const versionString =
      firstVersion === lastVersion
        ? getVersionName(firstVersion)
        : `${getVersionName(firstVersion)} - ${getVersionName(lastVersion)}`;

    const link =
      parent &&
      parent.type === "ArchivedDialogueTable" &&
      `/d/${parent.hash}/${node.hash}`;

    const content = `Dialogue Tree ${node.hash} (${versionString})`;

    return (
      <div className={cx(s.row, index % 2 && s.alternateRow)} style={style}>
        <div className={cx(s.rowMain, s.faint)}>
          <Indent level={nestingLevel} />
          <DisclosureButton isOpen={isOpen} onClick={toggleOpen} />
          <span className="Space" />
          {link ? (
            <Link className={s.link} to={link}>
              {content}
            </Link>
          ) : (
            content
          )}
        </div>

        {link && (
          <div className={s.rowAccessory}>
            <Link to={link} className={s.permalink}>
              Permalink
            </Link>
          </div>
        )}
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
          <DisclosureButton isOpen={isOpen} onClick={toggleOpen} />
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
          <DisclosureButton isOpen={isOpen} onClick={toggleOpen} />
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
          {node.gender ? (
            <span className={s.gender}>
              <i
                className={`fa-regular ${
                  node.gender === "Masculine" ? "fa-mars" : "fa-venus"
                }`}
              />
            </span>
          ) : (
            <span className="toggleButtonSpacer" />
          )}
          <span
            className={s.narrator}
            style={{
              color: narrator ? pickColor(node.narrator) : "",
            }}
          >
            {narrator || <em>Unknown</em>}:
          </span>{" "}
          {node.caption}
        </div>

        <div className={s.accessory}>
          <DownloadButton className={s.downloadButton} node={node} />
          <span className="Space" />
          <PlayButton node={node} />
        </div>
      </div>
    );
  }

  return <div style={style}>Unhandled node type</div>;
};

export default Node;
