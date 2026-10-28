---
name: gsap-animation
description: Use when implementing advanced web animations, scroll effects, timelines, parallax, text reveals, or SVG animations with GSAP.
---

# GSAP Animation Skill

- Install `gsap`; register plugins before use.
- Use `gsap.context()` or React cleanup to kill timelines on unmount.
- Use ScrollTrigger for scroll-linked animation.
- Animate only `transform`, `opacity`, and SVG attributes where possible.
- Respect `prefers-reduced-motion`.
- Avoid fixed pixel timings; use responsive breakpoints.