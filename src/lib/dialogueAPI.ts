const NEXT_API = process.env.REACT_APP_NEXT_API === "true";

export const URL_BASE = NEXT_API
  ? "https://destiny-dialogue-project.s3.ap-southeast-2.amazonaws.com/_next"
  : "https://d2xuwv4utasxju.cloudfront.net";

export function getMP3URL(file: string) {
  return NEXT_API
    ? `${URL_BASE}/audio/${file}`
    : `${URL_BASE}/audio/${file}.mp3`;
}

export function getDialogueBankURL(file: string) {
  return `${URL_BASE}/${file}`;
}

export function getManifestURL() {
  return `${URL_BASE}/manifest.json`;
}
