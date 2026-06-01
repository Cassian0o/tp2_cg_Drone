import { registerDrawCall } from "../../renderer.js";
import { getLightingUniforms } from "../lighting.js";
import { mat4 } from "../../utils/math.js";
import { loadTexture } from "../../utils/textureLoader.js";

export function initRoads(gl) {
  const programInfo = twgl.createProgramInfo(gl, [
    "shaders/phong.vert",
    "shaders/phong.frag",
  ]);

  const arraysH = twgl.primitives.createPlaneVertices(500, 24);
  const arraysV = twgl.primitives.createPlaneVertices(24, 500);

  const bufferInfoH = twgl.createBufferInfoFromArrays(gl, arraysH);
  const bufferInfoV = twgl.createBufferInfoFromArrays(gl, arraysV);

  const texture = loadTexture(gl, "assets/textures/ground_specular.jpg");

  registerDrawCall((gl, globalUniforms) => {
    gl.useProgram(programInfo.program);
    twgl.setUniforms(programInfo, globalUniforms);
    twgl.setUniforms(programInfo, getLightingUniforms());

    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfoH);
    let worldH = mat4.identity();
    worldH = mat4.translate(worldH, [0, 0.1, 0]);
    twgl.setUniforms(programInfo, {
      u_world: worldH,
      u_worldInverseTranspose: mat4.transpose(mat4.inverse(worldH)),
      u_diffuseMap: texture,
    });
    twgl.drawBufferInfo(gl, bufferInfoH);

    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfoV);
    let worldV = mat4.identity();
    worldV = mat4.translate(worldV, [0, 0.11, 0]);
    twgl.setUniforms(programInfo, {
      u_world: worldV,
      u_worldInverseTranspose: mat4.transpose(mat4.inverse(worldV)),
      u_diffuseMap: texture,
    });
    twgl.drawBufferInfo(gl, bufferInfoV);
  });
}
