import { GameObject } from "../objects/GameObject.js";
import { AssetManager } from "../engine/AssetManager.js";

const vs = `#version 300 es
in vec4 a_position;
out vec4 v_position;
void main() {
    v_position = a_position;
    gl_Position = a_position;
    gl_Position.z = 1.0;
}`;

const fs = `#version 300 es
precision mediump float;
uniform samplerCube u_skybox;
uniform mat4 u_viewDirectionProjectionInverse;
uniform vec3 u_skyTint;
uniform float u_skyExposure;
in vec4 v_position;
out vec4 outColor;
void main() {
    vec4 t = u_viewDirectionProjectionInverse * v_position;
    vec4 sky = texture(u_skybox, normalize(t.xyz / t.w));
    float luminance = dot(sky.rgb, vec3(0.299, 0.587, 0.114));
    vec3 desaturated = mix(vec3(luminance), sky.rgb, 0.42);
    vec3 tinted = mix(desaturated, sky.rgb, u_skyExposure);
    outColor = vec4(tinted * u_skyTint * u_skyExposure, sky.a);
}`;

export class Skybox extends GameObject {
  constructor(gl) {
    super();
    this.castsShadow = false;
    this.transparent = true;
    this.programInfo = twgl.createProgramInfo(gl, [vs, fs]);

    const arrays = {
      position: {
        numComponents: 2,
        data: [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1],
      },
    };
    this.bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);

    // Usando os assets exatos fornecidos na pasta assets/skybox/
    AssetManager.loadCubemap("skybox", [
      "assets/skybox/px.png",
      "assets/skybox/nx.png",
      "assets/skybox/py.png",
      "assets/skybox/ny.png",
      "assets/skybox/pz.png",
      "assets/skybox/nz.png",
    ]);

    this.texture = AssetManager.getTexture("skybox");
  }

  draw(gl, globalUniforms) {
    gl.depthFunc(gl.LEQUAL);
    gl.useProgram(this.programInfo.program);
    twgl.setBuffersAndAttributes(gl, this.programInfo, this.bufferInfo);

    const viewMatrix = twgl.m4.inverse(globalUniforms.u_viewInverse);
    viewMatrix[12] = 0;
    viewMatrix[13] = 0;
    viewMatrix[14] = 0;

    const fov = (60 * Math.PI) / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const projection = twgl.m4.perspective(fov, aspect, 0.1, 2000);
    const viewProjection = twgl.m4.multiply(projection, viewMatrix);
    const sunAmount = Math.max(0, Math.min(1, -globalUniforms.u_lightDir[1]));
    const nightAmount = 1 - sunAmount;
    const skyTint = [
      0.08 + sunAmount * 0.92,
      0.12 + sunAmount * 0.88,
      0.25 + sunAmount * 0.75,
    ];
    const skyExposure = 0.22 + sunAmount * 0.78 - nightAmount * 0.05;

    twgl.setUniforms(this.programInfo, {
      u_viewDirectionProjectionInverse: twgl.m4.inverse(viewProjection),
      u_skybox: this.texture,
      u_skyTint: skyTint,
      u_skyExposure: skyExposure,
    });

    twgl.drawBufferInfo(gl, this.bufferInfo);
    gl.depthFunc(gl.LESS);
  }
}
