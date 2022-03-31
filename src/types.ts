export interface DialogueBank {
  entryKey: string;
  contentHash: number;
  id: string;
  dialogues: DialogueTree[];
}

export type DialogueNode = DialogueLine | DialogueSequence | DialogueBranch;

export interface DialogueTree {
  type: "DialogueTree";
  contentHash: number;
  id: string;

  dialogue: DialogueNode;
}

export interface DialogueLine {
  type: "DialogueLine";
  contentHash: number;
  id: string;

  audioFileName: string;
  nonUniqueGameHash: number;
  caption: string;
  narrator: string;

  /**
   * Total duration this line should be. Can be longer in sequences to account for delay in between lines
   */
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
