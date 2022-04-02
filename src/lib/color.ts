function hashCode(str: string) {
  let hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  return hash;
}

function clampHue(hue: number) {
  return hue % 360;
}

export function pickColor(str: string) {
  return `hsl(${clampHue(hashCode(str))}, 100%, 80%)`;
}
