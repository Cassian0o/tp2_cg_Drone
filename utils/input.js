export const keys = {};

export function initInput() {
  window.addEventListener("keydown", (e) => {
    keys[e.key.toUpperCase()] = true;
  });

  window.addEventListener("keyup", (e) => {
    keys[e.key.toUpperCase()] = false;
  });
}

export function isKeyPressed(key) {
  return !!keys[key.toUpperCase()];
}
