export function loadTexture(gl, url) {
  return twgl.createTexture(gl, {
    src: url,
    min: gl.LINEAR_MIPMAP_LINEAR,
    mag: gl.LINEAR,
    wrap: gl.REPEAT,
  });
}

export function loadCubemap(gl, urls) {
  return twgl.createTexture(gl, {
    target: gl.TEXTURE_CUBE_MAP,
    src: urls,
    min: gl.LINEAR_MIPMAP_LINEAR,
  });
}
