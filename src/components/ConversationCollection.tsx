import Indent from "./Indent";

import allDialogues from "../dialogue";
import DialogueNode from "./DialogueNode";

export default function ConversationCollection() {
  return (
    <table className="BigTable">
      <thead>
        <tr>
          <td className="meta dialogue-column">
            <Indent level={1} /> Dialogue
          </td>
          <td className="meta">Narrator</td>
          <td></td>
        </tr>
      </thead>

      <tbody>
        {allDialogues.map((dialogueCollection) => {
          return (
            <>
              <tr>
                <td>
                  Dialogue file {dialogueCollection.PackageId}_
                  {dialogueCollection.EntryIndex}
                </td>
                <td />
                <td />
              </tr>

              {dialogueCollection.Collections.map((tree) => {
                return (
                  <>
                    <tr>
                      <td>
                        <Indent level={1} /> Conversation{" "}
                        {tree.ConversationHash}
                      </td>
                      <td />
                      <td>
                        {" "}
                        <button className="actionButton">
                          <i className="far fa-play" /> Play
                        </button>
                      </td>
                    </tr>

                    <DialogueNode node={tree.Dialogue} level={2} />
                  </>
                );
              })}
            </>
          );
        })}
      </tbody>
    </table>
  );
}
