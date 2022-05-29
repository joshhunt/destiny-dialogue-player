export type ProgressReporter = (total: number, current: number) => void;

export default async function httpGetProgress(
  url: string,
  progressReporter: ProgressReporter
) {
  // Step 1: start the fetch and obtain a reader
  let response = await fetch(url);

  if (!response.body) {
    throw new Error("No body on response");
  }

  const reader = response.body.getReader();

  // Step 2: get total length
  const contentLength = parseInt(response.headers.get("Content-Length") ?? "0");

  // Step 3: read the data
  let receivedLength = 0; // received that many bytes at the moment
  let chunks = []; // array of received binary chunks (comprises the body)
  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    chunks.push(value);
    receivedLength += value.length;

    progressReporter(contentLength, receivedLength);
  }

  // Step 4: concatenate chunks into single Uint8Array
  let chunksAll = new Uint8Array(receivedLength); // (4.1)
  let position = 0;
  for (let chunk of chunks) {
    chunksAll.set(chunk, position); // (4.2)
    position += chunk.length;
  }

  // Step 5: decode into a string
  let result = new TextDecoder("utf-8").decode(chunksAll);

  // We're done!
  return JSON.parse(result);
}
