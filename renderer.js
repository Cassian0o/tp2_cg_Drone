// renderer.js
export let gl;
const drawCalls = [];

export function initRenderer(canvasId) {
  const canvas = document.getElementById(canvasId);
  gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
  if (!gl) throw new Error("WebGL não suportado");

  twgl.resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);

  return gl;
}

export function registerDrawCall(fn) {
  drawCalls.push(fn);
}

export function renderLoop(time) {
  twgl.resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clearColor(0.1, 0.1, 0.12, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const timeSec = time * 0.001;

  const fov = (60 * Math.PI) / 180;
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const projection = twgl.m4.perspective(fov, aspect, 0.1, 2000);

  const cameraParams = {
    eye: [80, 60, 120],
    target: [0, 0, 0],
    up: [0, 1, 0],
  };
  const cameraMatrix = twgl.m4.lookAt(
    cameraParams.eye,
    cameraParams.target,
    cameraParams.up,
  );
  const viewMatrix = twgl.m4.inverse(cameraMatrix);
  const viewProjection = twgl.m4.multiply(projection, viewMatrix);

  const globalUniforms = {
    u_viewInverse: cameraMatrix,
    u_worldViewProjection: viewProjection,
    u_viewPosition: cameraParams.eye,
    u_time: timeSec,
  };

  drawCalls.forEach((drawFn) => drawFn(gl, globalUniforms));

  requestAnimationFrame(renderLoop);
}
