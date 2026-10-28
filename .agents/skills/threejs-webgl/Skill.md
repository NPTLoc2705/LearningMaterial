---
name: threejs-webgl
description: Use when creating 3D web scenes, WebGL heroes, 3D product viewers, or Three.js integrations in React/Next.js.
---

# Three.js Web Skill

- Use `three` and, for React, `@react-three/fiber` + `@react-three/drei`.
- Always handle canvas resize and device pixel ratio.
- Use `Suspense` for async GLTF/texture loading.
- Prefer low-poly meshes, compressed textures, and instancing.
- Add `prefers-reduced-motion` fallback: static render instead of animation loop.
- Clean up geometries, materials, textures, and renderer on unmount.