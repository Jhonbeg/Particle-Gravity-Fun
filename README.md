# 🌌 Quantum Flux: Particle Gravity Engine

<p align="center">
  <img src="./demo.gif" alt="Cosmic Particles" width="100%">
</p>

![WASM Power](https://img.shields.io/badge/Powered_by-WebAssembly-orange?style=for-the-badge&logo=webassembly)
![Rust Core](https://img.shields.io/badge/Built_with-Rust-black?style=for-the-badge&logo=rust)
![Three.js Visuals](https://img.shields.io/badge/Rendered_in-Three.js-white?style=for-the-badge&logo=three.js)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

> **"Experience the beauty of math and physics in your browser."**
>
> *⚠️ Source code is intentionally minimized and compiled. This repository focuses on the **demo and experience**, not raw implementation details.*
---

## 🚀 Overview

<a href="https://git.io/typing-svg"><img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&pause=1000&color=2196F3&center=false&vCenter=false&width=500&lines=Quantum+Flux+is+a+high-performance;interactive+particle+simulation;powered+by+Rust+and+WebAssembly.;8%2C000+particles+responding+to+your+hand+gestures." alt="Typing SVG" /></a>

### ✨ Key Features

| Feature | Description |
| :--- | :--- |
| **⚡ WASM Physics** | Core attraction and swarming logic runs in raw **WebAssembly** for maximum FPS. |
| **✋ Hand Tracking** | Control the swarm with your **Index Finger** using MediaPipe. |
| **🤏 Gestures** | **Pinch** to trigger a cosmic color explosion. |
| **🪐 Shape Shifting** | Morph particles into Hearts, Planets, Flowers, and Fireworks. |
| **🔒 Security** | Heavily obfuscated client and opaque binary logic. |

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

---

## 👤 Author

**Yogender**  
*   [Connect on LinkedIn](https://www.linkedin.com/in/yogender1/)

---

<p align="center">
  <h2>🌟 Support My Work!</h2>
  <p>If you enjoy this project, please star the repository! It helps a lot!</p>
  <a href="https://github.com/yogender-ai/Particle-Gravity-Fun">
    <img src="https://img.shields.io/badge/⭐_Star_this_Repo-Thank_you!-yellow?style=for-the-badge" alt="Star Repo">
  </a>
</p>

<p align="center">
  <i>Created with ❤️ by Yogender</i>
</p>


