<<<<<<< HEAD
# Particle-Gravity-Fun
=======
# 🌌 Quantum Flux: Particle Gravity Engine

![WASM Power](https://img.shields.io/badge/Powered_by-WebAssembly-orange?style=for-the-badge&logo=webassembly)
![Rust Core](https://img.shields.io/badge/Built_with-Rust-black?style=for-the-badge&logo=rust)
![Three.js Visuals](https://img.shields.io/badge/Rendered_in-Three.js-white?style=for-the-badge&logo=three.js)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

> **"Experience the beauty of math and physics in your browser."**

---

## 🌟 Support My Work!

**If you enjoy this project, please star the repository! It helps a lot!**  
👇👇👇  
**[github.com/yogender-ai/Particle-Gravity-Fun](https://github.com/yogender-ai/Particle-Gravity-Fun)**

---

## 🚀 Overview

**Quantum Flux** is a high-performance, interactive particle simulation powered by a **Rust-compiled WebAssembly core**. It features 8,000 particles responding to hand gestures in real-time.

### ✨ Key Features
*   **WASM-Powered Physics**: Core attraction and swarming logic runs in raw WebAssembly for maximum FPS.
*   **Hand Tracking**: Control the swarm with your **Index Finger** using MediaPipe.
*   **Gestures**: **Pinch** to trigger a cosmic color explosions.
*   **Shape Shifting**: Morph particles into Hearts, Planets, Flowers, and Fireworks.
*   **Security**: Heavily obfuscated client and opaque binary logic.

---

## 🎮 How to Play

1.  **Allow Camera Access**: The app needs to see your hand.
2.  **Point your Index Finger**: The swarm will orbit your fingertip.
3.  **Pinch (Index + Thumb)**: Watch the particles surge with energy and change color!
4.  **Use UI Buttons**: Switch between formation modes (Heart, Saturn, etc.).

---

## 🛠️ Architecture

```mermaid
graph TD
    A[User Hand] -->|MediaPipe| B(JS Client);
    B -->|Coordinates| C{WASM Engine};
    C -->|Physics Update| C;
    C -->|Raw Memory View| B;
    B -->|Three.js| D[Canvas Renderer];
```

*   **Engine**: Rust (`no_std`, `wasm32-unknown-unknown`)
*   **Renderer**: Three.js (WebGL)
*   **Input**: MediaPipe Hands

---

## 👤 Author

**Yogender**  
*   [LinkedIn](https://www.linkedin.com/in/yogender1/)
*   [GitHub](https://github.com/yogender-ai)

---

<p align="center">
  <i>Created with ❤️ by Yogender-AI</i>
</p>
>>>>>>> 3ac0ed2 (Quantum Flux: Particle Gravity Engine)
