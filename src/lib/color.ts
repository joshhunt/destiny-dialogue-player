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

export function pickColor(str: string) {
  const hash = hashCode(str);
  return hashToHue(hash);
}
