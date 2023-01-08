interface VersionSpec {
  routeName: string;
  shortName: string;
  verboseName: string;
  version: string;
  hideInVersionList?: boolean;
}

export const versions: Record<string, VersionSpec> = {
  "78698.19.10.18.1444.d2_rc": {
    routeName: "undying",
    version: "78698.19.10.18.1444.d2_rc",
    shortName: "Shadowkeep",
    verboseName: "2.6.1.1 (Shadowkeep/Undying)",
  },

  "87221.20.09.10.1506.d2_live": {
    routeName: "arrivals",
    version: "87221.20.09.10.1506.d2_live",
    shortName: "Arrivals",
    verboseName: "2.9.2.1 (Arrivals)",
  },

  "101478.22.01.22.2200.v500_live.main": {
    routeName: "lost",
    version: "101478.22.01.22.2200.v500_live.main",
    shortName: "Lost",
    verboseName: "3.4.0.4 (Lost/30th Anniversary)",
  },

  "104642.22.04.26.1901.v500_live.main": {
    routeName: "witch-queen",
    version: "104642.22.04.26.1901.v500_live.main",
    shortName: "Witch Queen",
    verboseName: "4.0.1.2 (Witch Queen/Risen)",
  },

  // shouldn't be used anymore
  "105043.22.05.11.1611.v500_rc.main": {
    routeName: "haunted-early",
    version: "105043.22.05.11.1611.v500_rc.main",
    shortName: "Haunted",
    verboseName: "4.1.0.0 ()",
    hideInVersionList: true,
  },

  "107233.22.07.27.1901.v500_live.main": {
    routeName: "haunted",
    version: "107233.22.07.27.1901.v500_live.main",
    shortName: "Haunted",
    verboseName: "4.1.5.0 (Haunted)",
  },

  "109859.22.11.01.1900.v500_live.main": {
    routeName: "plunder",
    version: "109859.22.11.01.1900.v500_live.main",
    shortName: "Plunder",
    verboseName: "6.2.5.3 (Plunder)",
  },

  "111215.22.12.12.1450.v500_live.main": {
    routeName: "seraph-pre",
    version: "111215.22.12.12.1450.v500_live.main",
    shortName: "Seraph (Prerelease)",
    verboseName: "6.3.x.x (Seraph Prerelease)",
    hideInVersionList: true,
  },
};

export const latestBuildId = Math.max(
  ...Object.keys(versions)
    .map((versionString) => {
      return versionString.match(/(\d+)\./)?.[1];
    })
    .map((v) => parseInt(v ?? "0"))
    .filter(Boolean)
);

export function getVersionName(versionId: string): string {
  return versions[versionId]?.shortName ?? "Unknown";
}
