// Carrega um modelo OBJ simples e converte para TWGL buffer info.
export async function loadObj(gl, url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`OBJ não encontrado: ${url}`);
  const text = await response.text();
  return parseObj(gl, text);
}

function parseObj(gl, text) {
  const positions = []; // vértices crus do arquivo
  const texcoords = []; // coordenadas de textura crus do arquivo
  const normals = []; // normais crus do arquivo

  const outPos = []; // arrays finais (indexados por face)
  const outTex = [];
  const outNorm = [];

  const lines = text.split("\n");

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const parts = line.split(/\s+/);
    const cmd = parts[0];

    if (cmd === "v") {
      // vertices podem ter cor extra (Kenney: x y z r g b) — ignoramos rgb
      positions.push(
        parseFloat(parts[1]),
        parseFloat(parts[2]),
        parseFloat(parts[3]),
      );
    } else if (cmd === "vt") {
      texcoords.push(parseFloat(parts[1]), parseFloat(parts[2]));
    } else if (cmd === "vn") {
      normals.push(
        parseFloat(parts[1]),
        parseFloat(parts[2]),
        parseFloat(parts[3]),
      );
    } else if (cmd === "f") {
      // Suporta polígonos com triangulação em fan.
      const verts = parts.slice(1);
      for (let i = 1; i < verts.length - 1; i++) {
        pushVertex(
          verts[0],
          positions,
          texcoords,
          normals,
          outPos,
          outTex,
          outNorm,
        );
        pushVertex(
          verts[i],
          positions,
          texcoords,
          normals,
          outPos,
          outTex,
          outNorm,
        );
        pushVertex(
          verts[i + 1],
          positions,
          texcoords,
          normals,
          outPos,
          outTex,
          outNorm,
        );
      }
    }
  }

  const arrays = {
    position: { numComponents: 3, data: new Float32Array(outPos) },
    texcoord: { numComponents: 2, data: new Float32Array(outTex) },
    normal: { numComponents: 3, data: new Float32Array(outNorm) },
  };

  return twgl.createBufferInfoFromArrays(gl, arrays);
}

// Empurra um vértice "v/vt/vn" (ou "v//vn" ou "v") nos arrays de saída
function pushVertex(
  token,
  positions,
  texcoords,
  normals,
  outPos,
  outTex,
  outNorm,
) {
  const idx = token.split("/");

  const pi = (parseInt(idx[0]) - 1) * 3;
  outPos.push(positions[pi], positions[pi + 1], positions[pi + 2]);

  if (idx[1] && idx[1] !== "") {
    const ti = (parseInt(idx[1]) - 1) * 2;
    outTex.push(texcoords[ti], texcoords[ti + 1]);
  } else {
    outTex.push(0, 0);
  }

  if (idx[2] && idx[2] !== "") {
    const ni = (parseInt(idx[2]) - 1) * 3;
    outNorm.push(normals[ni], normals[ni + 1], normals[ni + 2]);
  } else {
    outNorm.push(0, 1, 0);
  }
}
