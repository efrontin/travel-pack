/** `data:image/jpeg;base64,…` → Blob. */
export function dataUrlToBlob(dataUrl: string): Blob {
  const match = /^data:([^;,]*)(;base64)?,(.*)$/s.exec(dataUrl);
  if (!match) throw new Error('Image illisible');
  const [, type, base64, payload] = match;
  const raw = base64 ? atob(payload) : decodeURIComponent(payload);
  const bytes = Uint8Array.from(raw, (c) => c.charCodeAt(0));
  return new Blob([bytes], { type: type || 'application/octet-stream' });
}

/** Blob → `data:<type>;base64,…`. */
export async function blobToDataUrl(blob: Blob): Promise<string> {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let raw = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    raw += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return `data:${blob.type || 'application/octet-stream'};base64,${btoa(raw)}`;
}
