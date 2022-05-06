const LOCAL_API = true;

export const URL_BASE = LOCAL_API
  ? "http://localhost:3333"
  : "https://d2xuwv4utasxju.cloudfront.net";

export function getMP3URL(file: string) {
  return LOCAL_API
    ? `${URL_BASE}/audio/${file}`
    : `${URL_BASE}/audio/${file}.mp3`;
}

export function getDialogueBankURL(file: string) {
  return `${URL_BASE}/dialogue-banks/${file}`;
}

export function getManifestURL() {
  return `${URL_BASE}/manifest.json`;
}
