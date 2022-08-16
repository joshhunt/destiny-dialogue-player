import React from "react";
import { versions } from "../lib/versionMap";

interface IncludedDialogueProps {}

const IncludedDialogue: React.FC<IncludedDialogueProps> = () => {
  return (
    <ul>
      {Object.values(versions)
        .filter((v) => !v.hideInVersionList)
        .map((v, index) => (
          <li key={index}>{v.verboseName}</li>
        ))}
    </ul>
  );
};

export default IncludedDialogue;
