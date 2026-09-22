import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import type { Object3D } from 'three';

// The 3D object currently in the viewport, registered by MeshDisplay /
// ProceduralMeshDisplay. Export always serializes this — never the whole
// scene (which would drag in the grid helper, lights and environment).
let exportObject: Object3D | null = null;

export function setExportObject(obj: Object3D | null) {
  exportObject = obj;
}

export async function exportGLB(): Promise<Blob> {
  if (!exportObject) {
    throw new Error('Nothing to export yet — generate a mesh first.');
  }
  const obj = exportObject;
  const exporter = new GLTFExporter();

  // Freeze the turntable spin so the file matches the layout data,
  // not whatever rotation angle the viewport happened to be at.
  const prevY = obj.rotation.y;
  obj.rotation.y = 0;
  try {
    const result = await new Promise<ArrayBuffer>((resolve, reject) => {
      exporter.parse(
        obj,
        (res) => resolve(res as ArrayBuffer),
        (err) => reject(err instanceof Error ? err : new Error(String(err))),
        { binary: true },
      );
    });
    return new Blob([result], { type: 'model/gltf-binary' });
  } finally {
    obj.rotation.y = prevY;
  }
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadText(text: string, filename: string) {
  downloadBlob(new Blob([text], { type: 'application/json' }), filename);
}
