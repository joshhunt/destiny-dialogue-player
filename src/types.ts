export interface DialogueTable {
  type: "ArchivedDialogueTable";
  hash: number;
  id: string;
  contentPath?: string;

  dialogues: DialogueTree[];
}

export interface FilteredDialogueTable {
  type: "FilteredDialogueTable";
  hash: number;
  id: string;
  contentPath?: string;

  lines: DialogueLine[] | DialogueTree[];
}

export interface DialogueTree {
  type: "ArchivedDialogueTree";
  versions: string[];
  dialogue: DialogueNode;
  hash: number;
  id: string;
}

export type DialogueNode = DialogueLine | DialogueSequence | DialogueBranch;

export type AnyDialogueStructure =
  | DialogueTable
  | DialogueTree
  | DialogueNode
  | FilteredDialogueTable;

export type LineID = string | number;

export type Gender = "Masculine" | "Feminine";

export interface DialogueLine {
  type: "DialogueLine";
  audioFileName: string;
  contentHash: number;
  caption: string;
  narrator: string;
  postLineDelay: number;
  id: LineID;
  gender?: Gender;
}

export interface DialogueSequence {
  type: "DialogueSequence";
  contentHash: number;
  id: string;
  sequence: DialogueNode[];
}

export interface DialogueBranch {
  type: "DialogueBranch";
  contentHash: number;
  id: string;
  options: DialogueNode[];
  hasGenderedOptions?: boolean;
}

export interface DialogueBankManifestEntry {
  hash: number;
  jsonHash: number;
  fileName: string;
}

export interface DialogueManifest {
  version: number;
  dialoguePath: string;
}

export type CurrentDialogueState = {
  now?: DialogueLine | undefined;
  delay?: number | undefined;
  next?: DialogueLine | undefined;
  loading?: boolean;
  playing?: boolean;
};
