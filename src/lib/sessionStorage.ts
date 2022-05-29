const nodeStateStorage: Record<string, boolean> = {};

export function saveNodeState(id: string, isOpen: boolean) {
  nodeStateStorage[id] = isOpen;
}

export function getNodeState(id: string): boolean {
  return !!nodeStateStorage[id];
}
