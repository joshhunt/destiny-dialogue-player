export const versionMap: Record<string, string> = {
  "78698.19.10.18.1444.d2_rc": "Undying",
  "87221.20.09.10.1506.d2_live": "Arrivals",
  "101478.22.01.22.2200.v500_live.main": "30th Anniversary",
  "104642.22.04.26.1901.v500_live.main": "Risen",
  "105043.22.05.11.1611.v500_rc.main": "Haunted", // early
  "107233.22.07.27.1901.v500_live.main": "Haunted", // 4150, end of season
};

export function getVersionName(versionId: string) {
  return versionMap[versionId] ?? "Unknown";
}
