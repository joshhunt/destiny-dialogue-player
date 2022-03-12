export interface DialogueFile {
  Collections: DialogueConversation[];
  Hash64: string;
  PackageId: number;
  EntryIndex: number;
}

export interface DialogueConversation {
  ConversationHash: number;
  UniqueID: string;
  Dialogue: DialogueNode;
}

export type DialogueNode = DialogueLine | DialogueCollection | DialogueSequence;

export interface DialogueLine {
  Type: "DialogueLine";
  AudioFile: {
    RelativeFilePath: string;
  };
  DialogueLineHash: number;
  Caption: string;
  Narrator: string;
}

export interface DialogueCollection {
  Type: "DialogueCollection";
  Collection: DialogueNode[];
}

export interface DialogueSequence {
  Type: "DialogueSequence";
  Sequence: DialogueNode[];
}
