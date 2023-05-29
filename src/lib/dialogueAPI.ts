import { latestBuildId } from "./versionMap";

const API_BASE_CONFIG = process.env.REACT_APP_API_BASE;
export const URL_BASE =
  API_BASE_CONFIG || "https://d2xuwv4utasxju.cloudfront.net";

console.log({ API_BASE_CONFIG, URL_BASE });

export function getMP3URL(file: string) {
  return `${URL_BASE}/audio/${file}`;
}

export function getDialogueBankURL(file: string) {
  return `${URL_BASE}/${file}`;
}

export function getManifestURL(manifestName: string) {
  return `${URL_BASE}/${manifestName}.json?${latestBuildId}`;
}
