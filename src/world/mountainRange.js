import { GameObject } from "../objects/GameObject.js";

const SEGMENTS = 112;
const RINGS = [
  { radius: 300, baseHeight: 0.4, variance: 0 },
  { radius: 360, baseHeight: 24, variance: 16 },
  { radius: 440, baseHeight: 82, variance: 38 },
  { radius: 515, baseHeight: 36, variance: 18 },
  { radius: 590, baseHeight: -8, variance: 0 },
];

function peakNoise(index, ringIndex) {
  const a = index * 1.713 + ringIndex * 4.91;
  const b = index * 0.377 + ringIndex * 2.43;
  return Math.sin(a) * 0.55 + Math.sin(b) * 0.35 + Math.sin(a * 0.31 + b) * 0.1;
}

function subtract(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function cross(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

function normalize(v) {
  const len = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / len, v[1] / len, v[2] / len];
}

export class MountainRange extends GameObject {
  constructor(gl, programInfo) {
    super();
    this.programInfo = programInfo;
    this.castsShadow = false;
    this.materialColor = [0.72, 0.78, 0.66];
    this.texture = this._createTexture(gl);
    this.bufferInfo = this._createBufferInfo(gl);
  }

  _createBufferInfo(gl) {
    const positions = [];
    const normals = [];
    const texcoords = [];
    const rings = RINGS.map((ring, ringIndex) => {
      const vertices = [];
      for (let i = 0; i <= SEGMENTS; i++) {
        const wrapped = i % SEGMENTS;
        const angle = (wrapped / SEGMENTS) * Math.PI * 2;
        const wave = peakNoise(wrapped, ringIndex);
        const height = ring.baseHeight + ring.variance * wave;
        const radius =
          ring.radius +
          (ringIndex > 0 ? peakNoise(wrapped, ringIndex + 7) * 10 : 0);
        vertices.push([
          Math.cos(angle) * radius,
          Math.max(height, ring.baseHeight === -8 ? -8 : 0.3),
          Math.sin(angle) * radius,
        ]);
      }
      return vertices;
    });

    const pushTri = (a, b, c, ta, tb, tc) => {
      let normal = normalize(cross(subtract(b, a), subtract(c, a)));
      let p1 = b;
      let p2 = c;
      let t1 = tb;
      let t2 = tc;

      if (normal[1] < 0) {
        p1 = c;
        p2 = b;
        t1 = tc;
        t2 = tb;
        normal = normalize(cross(subtract(p1, a), subtract(p2, a)));
      }

      [a, p1, p2].forEach((p) => positions.push(p[0], p[1], p[2]));
      [0, 1, 2].forEach(() => normals.push(normal[0], normal[1], normal[2]));
      [ta, t1, t2].forEach((t) => texcoords.push(t[0], t[1]));
    };

    for (let ring = 0; ring < RINGS.length - 1; ring++) {
      for (let i = 0; i < SEGMENTS; i++) {
        const a = rings[ring][i];
        const b = rings[ring][i + 1];
        const c = rings[ring + 1][i];
        const d = rings[ring + 1][i + 1];
        const u0 = i / SEGMENTS;
        const u1 = (i + 1) / SEGMENTS;
        const v0 = ring / (RINGS.length - 1);
        const v1 = (ring + 1) / (RINGS.length - 1);

        pushTri(a, b, c, [u0, v0], [u1, v0], [u0, v1]);
        pushTri(c, b, d, [u0, v1], [u1, v0], [u1, v1]);
      }
    }

    return twgl.createBufferInfoFromArrays(gl, {
      position: { numComponents: 3, data: new Float32Array(positions) },
      normal: { numComponents: 3, data: new Float32Array(normals) },
      texcoord: { numComponents: 2, data: new Float32Array(texcoords) },
    });
  }

  _createTexture(gl) {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");

    const gradient = ctx.createLinearGradient(0, 256, 0, 0);
    gradient.addColorStop(0, "#374326");
    gradient.addColorStop(0.35, "#596043");
    gradient.addColorStop(0.72, "#6e6b61");
    gradient.addColorStop(1, "#d6d8cf");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);

    for (let i = 0; i < 900; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const shade = 65 + Math.random() * 80;
      ctx.fillStyle = `rgba(${shade}, ${shade}, ${shade}, ${0.08 + Math.random() * 0.1})`;
      ctx.fillRect(x, y, 1 + Math.random() * 3, 1 + Math.random() * 3);
    }

    ctx.strokeStyle = "rgba(28, 34, 28, 0.18)";
    ctx.lineWidth = 2;
    for (let x = -80; x < 300; x += 28) {
      ctx.beginPath();
      ctx.moveTo(x, 256);
      ctx.lineTo(x + 120, 0);
      ctx.stroke();
    }

    return twgl.createTexture(gl, {
      src: canvas,
      min: gl.LINEAR_MIPMAP_LINEAR,
      mag: gl.LINEAR,
      wrap: gl.REPEAT,
    });
  }
}
