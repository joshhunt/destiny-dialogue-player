import { DialogueLine, DialogueNode } from "../types";

export function collectAllLines(children: DialogueNode[]): DialogueLine[] {
  return children.flatMap((child) => {
    const type = child.Type;

    if (child.Type === "DialogueLine") {
      return child;
    } else if (child.Type === "DialogueCollection") {
      return collectAllLines(child.Collection);
    } else if (child.Type === "DialogueSequence") {
      return collectAllLines(child.Sequence);
    }

    throw new Error("Unknown type for DialogueNode: " + type);
  });
}

export function summarizeLines(children: DialogueNode[]) {
  const lines = collectAllLines(children);
  const captions: string[] = [];
  const narrators: string[] = [];

  for (const line of lines) {
    captions.push(line.Caption);

    if (!narrators.includes(line.Narrator)) {
      narrators.push(line.Narrator);
    }
  }

  return {
    captions,
    narrators,
  };
}

export function formattedSummary(children: DialogueNode[]) {
  const summary = summarizeLines(children);

  const aboutLines =
    summary.captions.length === 1
      ? `${summary.captions.length} line`
      : `${summary.captions.length} lines`;

  let aboutNarrators: React.ReactNode;

  const [narratorA, narratorB, narratorC] = summary.narrators;
  if (summary.narrators.length === 1) {
    aboutNarrators = narratorA;
  } else if (summary.narrators.length === 2) {
    aboutNarrators = (
      <>
        {narratorA} and {narratorB}
      </>
    );
  } else if (summary.narrators.length === 3) {
    aboutNarrators = (
      <>
        {narratorA}, {narratorB}, and {narratorC}
      </>
    );
  } else {
    aboutNarrators = (
      <>
        {narratorA}, {narratorB}, and {summary.narrators.length - 2} others
      </>
    );
  }

  return (
    <>
      {aboutLines} by {aboutNarrators}
    </>
  );
}
