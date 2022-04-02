import { pickColor } from "../lib/color";

interface Props {
  text: string;
}

export default function Coloured({ text }: Props) {
  const color = pickColor(text);
  return <span style={{ color }}>{text}</span>;
}
