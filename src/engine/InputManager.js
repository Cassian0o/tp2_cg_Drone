export class InputManager {
  static keys = {};

  static init() {
    window.addEventListener("keydown", (e) => {
      this.keys[e.key.toUpperCase()] = true;
    });
    window.addEventListener("keyup", (e) => {
      this.keys[e.key.toUpperCase()] = false;
    });
  }

  static isKeyPressed(key) {
    return !!this.keys[key.toUpperCase()];
  }
}
