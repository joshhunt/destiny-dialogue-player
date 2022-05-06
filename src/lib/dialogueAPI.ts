export const URL_BASE = "https://d2xuwv4utasxju.cloudfront.net";

// export const URL_BASE = "http://localhost:3333/";

export function getMP3URL(file: string) {
  return `${URL_BASE}/audio/${file}.mp3`;
  // return `${URL_BASE}/audio/${file}`;
}

export function getDialogueBankURL(file: string) {
  return `${URL_BASE}/dialogue-banks/${file}`;
}

export function getManifestURL() {
  return `${URL_BASE}/manifest.json`;
}
