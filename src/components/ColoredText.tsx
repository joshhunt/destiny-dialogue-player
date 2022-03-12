import sample from "lodash/sample";

interface Props {
  text: string;
}

export default function Coloured({ text }: Props) {
  const color = colorForWord(text);
  return <span style={{ color }}>{text}</span>;
}

const remember: Record<string, string | undefined> = {};

export function colorForWord(word: string) {
  if (remember[word]) {
    return remember[word];
  }

  const randomColor = sample(COLORS);
  remember[word] = randomColor;
  COLORS = COLORS.filter((v) => v !== randomColor);

  return remember[word];
}

let COLORS = ["#00a8ff", "#9c88ff", "#e84118", "#fbc531", "#4cd137", "#487eb0"];
