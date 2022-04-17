export interface DialogueBank {
  entryKey: string;
  contentHash: number;
  id: string;
  dialogues: DialogueTree[];
  contentPath?: string;
}

export type DialogueNode = DialogueLine | DialogueSequence | DialogueBranch;
export type AnyDialogueNode =
  | DialogueNode
  | DialogueBank
  | FilteredDialogueBank;
export type LineType = string | number;

export interface FilteredDialogueBank {
  type: "FilteredDialogueBank";
  entryKey: string;
  contentHash: number;
  id: string;
  lines: DialogueLine[] | DialogueTree[];
  contentPath?: string;
}

export interface DialogueTree {
  type: "DialogueTree";
  contentHash: number;
  id: string;

  dialogue: DialogueNode;
}

export interface DialogueLine {
  type: "DialogueLine";
  contentHash: number;
  id: LineType;

  audioFileName: string;
  nonUniqueGameHash: number;
  caption: string;
  narrator: string;

  // This is actually the delay in between lines in a
  duration: number;
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
}

export interface DialogueBankManifestEntry {
  hash: number;
  jsonHash: number;
  fileName: string;
}

export interface DialogueManifest {
  version: number;
  dialogueBanks: DialogueBankManifestEntry[];
}

export type CurrentDialogueState = {
  now?: DialogueLine | undefined;
  delay?: number | undefined;
  next?: DialogueLine | undefined;
  loading?: boolean;
  playing?: boolean;
};
