import { latestBuildId } from "./versionMap";

const API_BASE_CONFIG = process.env.REACT_APP_API_BASE;
const USE_OGG = process.env.REACT_APP_USE_OGG;

export const URL_BASE =
  API_BASE_CONFIG || "https://d2xuwv4utasxju.cloudfront.net";

console.log({ API_BASE_CONFIG, USE_OGG, URL_BASE });

export function getMP3URL(file: string) {
  return USE_OGG
    ? `${URL_BASE}/audio/${file}`
    : `${URL_BASE}/audio/${file}.mp3`;
}

export function getDialogueBankURL(file: string) {
  return `${URL_BASE}/${file}`;
}

export function getManifestURL() {
  return `${URL_BASE}/manifest.json?${latestBuildId}`;
}
