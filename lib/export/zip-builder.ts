import JSZip from "jszip";

export async function buildSlidesZip(
  blobs: Blob[],
  title: string
): Promise<Blob> {
  const zip = new JSZip();

  for (let i = 0; i < blobs.length; i++) {
    const position =
      i === 0 ? "hook" : i === blobs.length - 1 ? "cta" : `slide-${i + 1}`;
    const name = `${String(i + 1).padStart(2, "0")}-${position}.jpg`;
    zip.file(name, blobs[i]);
  }

  return zip.generateAsync({ type: "blob" });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
