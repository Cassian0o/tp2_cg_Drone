# Drone Carrier — WebGL

**Disciplina:** Computação Gráfica  
**Curso:** Engenharia de Computação  
**Autores:** Thainá Martins e Marcelo Cassiano

---

## Descrição

Simulação 3D de um drone voador sobre uma cidade gerada proceduralmente, desenvolvida com WebGL puro usando a biblioteca auxiliar [twgl.js](https://twgljs.org/). O projeto implementa iluminação Phong, hierarquia de objetos, múltiplas câmeras interativas e diversos efeitos visuais extras.

O jogador controla o drone com as teclas WASD e pode alternar entre três modos de câmera para explorar a cidade.

---

## Como executar

1. Clone ou extraia o projeto
2. Sirva os arquivos com um servidor local (necessário por conta dos módulos ES6 e shaders):
   ```bash
   npx serve .
   # ou
   python3 -m http.server 8080
   ```
3. Acesse `http://localhost:8080` no navegador
4. Clique na tela para habilitar o áudio e iniciar

---

## Controles

| Tecla | Ação |
|---|---|
| `W` / `S` | Mover drone para frente / trás |
| `A` / `D` | Girar drone para esquerda / direita |
| `1` | Câmera aérea (visão de cima) |
| `2` | Câmera lateral |
| `C` | Alternar ângulo da câmera lateral (frente / esq / trás / dir) |
| `3` | Câmera dentro da cabine |
| `↑ ↓ ← →` | Girar o olhar na câmera da cabine |
| `L` | Toggle iluminação direcional |
| `N` | Toggle neblina |
| `P` | Pouso do Drone |
---

## Funcionalidades implementadas

### Obrigatórias

- **Boilerplate WebGL** — canvas, contexto WebGL2, loop de render com `requestAnimationFrame` e `deltaTime`
- **Utilitários matemáticos** — mat4, vec3 via twgl.js (`utils/math.js`)
- **Sistema de input** — teclado com `InputManager` estático
- **Texture loader** — `AssetManager` com cache de texturas
- **Shaders Phong** — vertex e fragment shaders com iluminação difusa, especular e ambiente
- **Terreno texturizado** — plano de 1000x1000 unidades
- **Prédios** — cubos com variações de escala posicionados em grid
- **Postes de luz** — cilindros espalhados pela cidade
- **Billboards / outdoors** — quads texturizados
- **Layout da cidade** — terreno, ruas, prédios e veículos posicionados harmonicamente (`city.js`, `roads.js`)
- **Iluminação direcional** — luz direcional com toggle pela tecla `L`
- **Drone Carrier** — hierarquia corpo + hélices + cabine (`DroneCarrier`, `Propeller`, `Cockpit`)
- **Controles de voo WASD** — movimentação no plano XZ com rotação
- **Câmera 1** — visão aérea acompanhando o drone (tecla `1`)
- **Câmera 2** — lateral com 4 ângulos alternáveis pela tecla `C` (tecla `2`)

### Extras

| Extra | Pontos | Responsável | Descrição |
|---|---|---|---|
| Skybox | +10% | Marcelo | Cubemap de 6 texturas ao redor da cena |
| Música de fundo | +3% | Marcelo | Áudio em loop ativado ao clicar na tela |
| Câmera 3 — cabine | +5% | Thainá | Câmera dentro do cockpit, setas giram o olhar (tecla `3`) |
| Vidro semitransparente | +4% | Thainá | Cockpit com alpha blending, desenhado por último |
| Ciclo dia/noite | +10% | Marcelo | Direção e cor da luz variam ao longo do tempo |
| Neblina | +4% | Marcelo | Fog exponencial ativado pela tecla `N` |
| Carros movimetando | +10% | Marcelo | 3 carros com rotas autônomas|
| Luzes pontuais nos postes | +4% | Marcelo | Point lights com atenuação nos 8 postes da cidade |
| Partículas de fumaça | +8% | Marcelo | Sistema de partículas emitidas na posição do drone |
| Grama billboard | +6% | Marcelo | Quads de grama sempre voltados para a câmera |

**Total de extras: +64%**

---

## Estrutura do projeto

```
tp2_cg_Drone/
├── index.html
├── main.js
├── renderer.js
├── shaders/
│   ├── phong.vert
│   └── phong.frag
├── src/
│   ├── camera/
│   │   └── Camera.js
│   ├── engine/
│   │   ├── Engine.js
│   │   ├── InputManager.js
│   │   └── AssetManager.js
│   ├── lighting.js
│   ├── objects/
│   │   ├── GameObject.js
│   │   ├── DroneCarrier.js
│   │   ├── Propeller.js
│   │   ├── Cockpit.js
│   │   ├── Building.js
│   │   ├── LampPost.js
│   │   ├── Billboard.js
│   │   ├── Vehicle.js
│   │   └── Cars.js
│   └── world/
│       ├── Scene.js
│       ├── city.js
│       ├── roads.js
│       ├── terrain.js
│       ├── Skybox.js
│       ├── dayNight.js
│       ├── fog.js
│       ├── particles.js
│       └── grass.js
├── utils/
│   ├── math.js
│   ├── input.js
│   └── textureLoader.js
└── assets/
    ├── audio/
    └── textures/
```

---

## Tecnologias

- WebGL2
- [twgl.js](https://twgljs.org/) — helper para WebGL
- JavaScript ES6 modules
- GLSL ES 3.00
