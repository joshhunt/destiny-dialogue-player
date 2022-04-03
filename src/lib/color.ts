import { params } from "./utils";

function hashCode(str: string) {
  let hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  return hash;
}

function hashToHue(hash: number) {
  return `hsl(${hash % 360}, 100%, 80%)`;
}

function hashToPickedColor(hash: number) {
  const index = Math.abs(hash % (COLORS.length - 1));
  return COLORS[index];
}

export function pickColor(str: string) {
  const hash = hashCode(str);

  if (params.picked) {
    return hashToPickedColor(hash);
  }

  return hashToHue(hash);
}

const COLORS = [
  "#00a8ff",
  "#9c88ff",
  "#fbc531",
  "#4cd137",
  "#487eb0",
  "#e84118",
  "#7f8fa6",
  "#0097e6",
  "#8c7ae6",
  "#e1b12c",
  "#44bd32",
  "#40739e",
  "#c23616",
  "#718093",
];
