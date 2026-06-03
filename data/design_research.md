# Design Research: Scroll Animation, Timeline Layouts, Particles & Dark+Gold Themes

> Compiled: 2026-05-20
> Purpose: Reference projects and techniques for LeBron James tribute/narrative website

---

## 1. SCROLL ANIMATION LIBRARIES & PROJECTS

### 1.1 GSAP ScrollTrigger (GreenSock)
- **URL**: https://github.com/greensock/GSAP
- **Docs**: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- **Tech**: JavaScript, works with any framework
- **Stars**: 19k+
- **Key Features**:
  - Pin elements while scrolling
  - Scrub animations to scroll position (smooth parallax)
  - Scroll-based timeline progression
  - Snap to sections
- **Reusable Code**:
```js
gsap.registerPlugin(ScrollTrigger);

// Pin a section and scrub animation with scroll
gsap.to('.hero-content', {
  y: -100,
  opacity: 0,
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
    pin: true
  }
});

// Stagger reveal on scroll
gsap.from('.timeline-item', {
  y: 60,
  opacity: 0,
  stagger: 0.2,
  scrollTrigger: {
    trigger: '.timeline',
    start: 'top 80%',
    toggleActions: 'play none none reverse'
  }
});
```
- **Why Use**: Industry standard, best performance, perfect for narrative storytelling. Scrub mode is ideal for LeBron career timeline.

### 1.2 Lenis (Smooth Scroll)
- **URL**: https://github.com/darkroomengineering/lenis
- **Tech**: JavaScript, lightweight
- **Stars**: 9k+
- **Key Features**:
  - Buttery smooth scroll with lerp interpolation
  - Integrates perfectly with GSAP ScrollTrigger
  - Normalizes scroll across devices
- **Reusable Code**:
```js
import Lenis from '@studio-freight/lenis'

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)
```
- **CSS Tip**: Add `html.lenis, html.lenis body { height: auto; }` and `html.lenis.lenis-smooth { scroll-behavior: auto; }`

### 1.3 Locomotive Scroll
- **URL**: https://github.com/locomotivemtl/locomotive-scroll
- **Tech**: JavaScript
- **Stars**: 7k+
- **Key Features**:
  - Smooth scrolling with momentum
  - Built-in parallax via data attributes
  - Scroll progress tracking
- **Reusable Code**:
```html
<div data-scroll-section>
  <h1 data-scroll data-scroll-speed="1">LeBron James</h1>
  <p data-scroll data-scroll-speed="-1">The King</p>
</div>
```
- **Note**: Lenis has largely replaced this, but the data-scroll-speed pattern is elegant.

### 1.4 Scrollama (Intersection Observer-based)
- **URL**: https://github.com/russellsamora/scrollama
- **Tech**: JavaScript, uses IntersectionObserver
- **Stars**: 4k+
- **Key Features**:
  - Lightweight scroll-driven storytelling
  - Step-based triggers (perfect for narrative sections)
  - Progress callback for granular control
- **Reusable Code**:
```js
const scroller = scrollama();
scroller.setup({
  step: '.story-step',
  offset: 0.5,
  debug: false
}).onStepEnter(response => {
  response.element.classList.add('is-active');
}).onStepExit(response => {
  response.element.classList.remove('is-active');
});
```

---

## 2. PARALLAX & STORYTELLING WEBSITES

### 2.1 Apple-style Product Pages (Common Pattern)
- **Technique**: Multi-layer parallax with scale transforms
- **Reusable CSS**:
```css
.parallax-container {
  perspective: 1px;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
}

.parallax-layer-back {
  transform: translateZ(-2px) scale(3);
}

.parallax-layer-base {
  transform: translateZ(0);
}
```

### 2.2 Horizontal Scroll Sections
- **URL**: https://codepen.io/collection/DgWQVx (various examples)
- **Technique**: GSAP horizontal scroll with ScrollTrigger
- **Reusable Code**:
```js
// Horizontal scroll for career timeline
let sections = gsap.utils.toArray('.career-section');
gsap.to(sections, {
  xPercent: -100 * (sections.length - 1),
  ease: 'none',
  scrollTrigger: {
    trigger: '.career-container',
    pin: true,
    scrub: 1,
    snap: 1 / (sections.length - 1),
    end: () => "+=" + document.querySelector('.career-container').offsetWidth
  }
});
```

### 2.3 Text Reveal on Scroll
- **Reusable CSS + JS**:
```css
.reveal-text {
  clip-path: polygon(0 0, 0 0, 0 100%, 0 100%);
  transition: clip-path 1s ease;
}

.reveal-text.is-visible {
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
}
```
```js
// Split text into spans for character-by-character reveal
document.querySelectorAll('.split-text').forEach(el => {
  el.innerHTML = el.textContent.replace(/\S/g, '<span class="char">$&</span>');
});
```

---

## 3. TIMELINE & RIVER-STYLE LAYOUTS

### 3.1 React Vertical Timeline Component
- **URL**: https://github.com/stephane-monnot/react-vertical-timeline
- **Tech**: React, CSS3
- **Stars**: 800+
- **Key Features**:
  - Alternating left/right timeline items
  - Animated entry on scroll
  - Customizable icons and content cards
- **Reusable CSS** (Vertical Line):
```css
.timeline {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
}

.timeline::after {
  content: '';
  position: absolute;
  width: 3px;
  background: linear-gradient(180deg, #c9a84c, #f0d68a, #c9a84c);
  top: 0;
  bottom: 0;
  left: 50%;
  margin-left: -1.5px;
}

.timeline-item {
  padding: 10px 40px;
  position: relative;
  width: 50%;
}

.timeline-item::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  background: #c9a84c;
  border: 3px solid #f0d68a;
  border-radius: 50%;
  top: 15px;
  right: -13px;
  z-index: 1;
  box-shadow: 0 0 15px rgba(201, 168, 76, 0.5);
}
```

### 3.2 River/Winding Path Layout
- **Technique**: SVG path as guide, elements positioned along path
- **Reusable Code**:
```css
/* River/winding path using CSS shapes */
.river-path {
  position: relative;
  width: 100%;
}

.river-node {
  position: relative;
  margin-bottom: 4rem;
}

.river-node:nth-child(odd) {
  margin-left: 20%;
  margin-right: 5%;
}

.river-node:nth-child(even) {
  margin-left: 5%;
  margin-right: 20%;
}

/* Connect nodes with curved line */
.river-node::before {
  content: '';
  position: absolute;
  width: 2px;
  height: 100px;
  background: linear-gradient(to bottom, #c9a84c, transparent);
  top: -100px;
  left: 50%;
}
```

### 3.3 SVG Path River Animation
- **Technique**: Animate a path drawing along scroll
- **Reusable Code**:
```js
// Draw SVG path on scroll
const path = document.querySelector('.river-svg path');
const pathLength = path.getTotalLength();

path.style.strokeDasharray = pathLength;
path.style.strokeDashoffset = pathLength;

window.addEventListener('scroll', () => {
  const scrollPercent = document.documentElement.scrollTop / 
    (document.documentElement.scrollHeight - window.innerHeight);
  path.style.strokeDashoffset = pathLength * (1 - scrollPercent);
});
```

---

## 4. PARTICLE EFFECTS & CANVAS RENDERING

### 4.1 tsParticles
- **URL**: https://github.com/tsparticles/tsparticles
- **Tech**: TypeScript, Canvas/WebGL
- **Stars**: 8k+
- **Key Features**:
  - Full particle system with connections, movement, interactivity
  - Works with React, Vue, Svelte, vanilla JS
  - Preset themes available
- **Reusable Config** (Gold Dust Particles):
```json
{
  "particles": {
    "number": { "value": 80, "density": { "enable": true, "value_area": 800 }},
    "color": { "value": ["#c9a84c", "#f0d68a", "#fff8dc"] },
    "shape": { "type": "circle" },
    "opacity": {
      "value": 0.6,
      "random": true,
      "anim": { "enable": true, "speed": 0.5, "opacity_min": 0.1 }
    },
    "size": {
      "value": 3,
      "random": true,
      "anim": { "enable": true, "speed": 2, "size_min": 0.5 }
    },
    "move": {
      "enable": true,
      "speed": 1,
      "direction": "none",
      "random": true,
      "out_mode": "out"
    },
    "line_linked": {
      "enable": true,
      "distance": 150,
      "color": "#c9a84c",
      "opacity": 0.2,
      "width": 1
    }
  },
  "interactivity": {
    "events": {
      "onhover": { "enable": true, "mode": "grab" },
      "onclick": { "enable": true, "mode": "push" }
    }
  }
}
```

### 4.2 Three.js Particle Systems
- **URL**: https://github.com/mrdoob/three.js
- **Tech**: WebGL, JavaScript/TypeScript
- **Stars**: 103k+
- **Reusable Code** (Floating Gold Particles):
```js
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });

// Create gold particle system
const particleCount = 2000;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);

const goldColor = new THREE.Color(0xc9a84c);
const lightGold = new THREE.Color(0xf0d68a);

for (let i = 0; i < particleCount; i++) {
  positions[i * 3] = (Math.random() - 0.5) * 20;
  positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
  
  const color = Math.random() > 0.5 ? goldColor : lightGold;
  colors[i * 3] = color.r;
  colors[i * 3 + 1] = color.g;
  colors[i * 3 + 2] = color.b;
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const material = new THREE.PointsMaterial({
  size: 0.05,
  vertexColors: true,
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending
});

const particles = new THREE.Points(geometry, material);
scene.add(particles);

// Animate
function animate() {
  requestAnimationFrame(animate);
  particles.rotation.y += 0.001;
  particles.rotation.x += 0.0005;
  renderer.render(scene, camera);
}
animate();
```

### 4.3 Canvas 2D Particle Background (Lightweight)
- **Reusable Code** (No library needed):
```js
class ParticleField {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null };
    this.resize();
    this.init();
    this.animate();
    
    window.addEventListener('resize', () => this.resize());
    canvas.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
  }
  
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  init() {
    for (let i = 0; i < 150; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        color: Math.random() > 0.5 ? '#c9a84c' : '#f0d68a'
      });
    }
  }
  
  drawParticle(p) {
    this.ctx.beginPath();
    this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    this.ctx.fillStyle = p.color;
    this.ctx.globalAlpha = p.opacity;
    this.ctx.fill();
  }
  
  drawConnections() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 120) {
          this.ctx.beginPath();
          this.ctx.strokeStyle = '#c9a84c';
          this.ctx.globalAlpha = (1 - dist / 120) * 0.15;
          this.ctx.lineWidth = 0.5;
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      
      if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;
      
      this.drawParticle(p);
    });
    
    this.drawConnections();
    this.ctx.globalAlpha = 1;
    requestAnimationFrame(() => this.animate());
  }
}
```

### 4.4 particles.js (Classic)
- **URL**: https://github.com/VincentGarreau/particles.js
- **Tech**: Canvas 2D, lightweight
- **Stars**: 29k+
- **Note**: tsParticles is the maintained successor. Use tsparticles for new projects.

---

## 5. DARK THEME + GOLD COLOR SCHEMES

### 5.1 Color Palette Reference
```
Primary Gold:     #C9A84C  (muted, elegant gold)
Light Gold:       #F0D68A  (highlight gold)
Dark Gold:        #8B7532  (shadow gold)
Cream Gold:       #FFF8DC  (cornsilk, for text highlights)
Background Dark:  #0A0A0A  (near black)
Surface Dark:     #141414  (card backgrounds)
Surface Medium:   #1A1A1A  (elevated surfaces)
Border Subtle:    #2A2A2A  (dividers)
Text Primary:     #F5F5F5  (main text)
Text Secondary:   #888888  (muted text)
Accent Glow:      rgba(201, 168, 76, 0.3)  (gold glow effect)
```

### 5.2 Dark Theme CSS Variables
```css
:root {
  --bg-primary: #0a0a0a;
  --bg-secondary: #141414;
  --bg-tertiary: #1a1a1a;
  --gold-primary: #c9a84c;
  --gold-light: #f0d68a;
  --gold-dark: #8b7532;
  --gold-glow: rgba(201, 168, 76, 0.3);
  --text-primary: #f5f5f5;
  --text-secondary: #888888;
  --border-color: #2a2a2a;
}

body {
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: 'Inter', -apple-system, sans-serif;
}
```

### 5.3 Gold Gradient Text Effect
```css
.gold-text {
  background: linear-gradient(135deg, #c9a84c 0%, #f0d68a 50%, #c9a84c 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 3s ease-in-out infinite;
}

@keyframes shimmer {
  0% { background-position: 0% center; }
  100% { background-position: 200% center; }
}
```

### 5.4 Gold Border Glow Effect
```css
.gold-glow {
  border: 1px solid rgba(201, 168, 76, 0.3);
  box-shadow: 
    0 0 15px rgba(201, 168, 76, 0.1),
    inset 0 0 15px rgba(201, 168, 76, 0.05);
  transition: box-shadow 0.3s ease;
}

.gold-glow:hover {
  border-color: rgba(201, 168, 76, 0.6);
  box-shadow: 
    0 0 30px rgba(201, 168, 76, 0.2),
    0 0 60px rgba(201, 168, 76, 0.1),
    inset 0 0 30px rgba(201, 168, 76, 0.1);
}
```

### 5.5 Dark Card with Gold Accent
```css
.dark-card {
  background: linear-gradient(145deg, #141414, #1a1a1a);
  border-radius: 12px;
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.dark-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #c9a84c, transparent);
}

.dark-card::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at center, rgba(201, 168, 76, 0.03), transparent 50%);
  pointer-events: none;
}
```

### 5.6 Similar GitHub Projects
- **Brittany Chiang's Portfolio**: https://github.com/bchiang7/v4
  - React, dark theme, clean animations
  - 7k+ stars, highly referenced
  
- **Portfolio Ideas**: https://github.com/search?q=dark+theme+gold+portfolio&type=repositories
  - Various implementations of dark+gold designs

---

## 6. NOTABLE PORTFOLIO / NARRATIVE WEBSITES

### 6.1 react-chrono (Timeline Component)
- **URL**: https://github.com/prabhuign/react-chrono
- **Tech**: React, TypeScript
- **Stars**: 3k+
- **Key Features**:
  - Horizontal, vertical, and tree layouts
  - Media support (images, videos)
  - Slideshow mode
  - Keyboard accessible
- **Why Useful**: Ready-made timeline component for LeBron's career milestones

### 6.2 framer-motion
- **URL**: https://github.com/framer/motion
- **Tech**: React
- **Stars**: 23k+
- **Reusable Code** (Scroll-linked animations):
```jsx
import { motion, useScroll, useTransform } from 'framer-motion';

function HeroSection() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);
  
  return (
    <motion.section style={{ opacity, scale }}>
      <h1>LeBron James</h1>
    </motion.section>
  );
}
```

### 6.3 barba.js (Page Transitions)
- **URL**: https://github.com/barbajs/barba
- **Tech**: JavaScript
- **Stars**: 4k+
- **Why Useful**: Smooth transitions between "chapters" of the story
- **Reusable Code**:
```js
barba.init({
  transitions: [{
    name: 'gold-fade',
    leave(data) {
      return gsap.to(data.current.container, {
        opacity: 0,
        filter: 'sepia(1) brightness(1.5)',
        duration: 0.5
      });
    },
    enter(data) {
      return gsap.from(data.next.container, {
        opacity: 0,
        filter: 'sepia(1) brightness(1.5)',
        duration: 0.5
      });
    }
  }]
});
```

### 6.4 Theatre.js (Animation Editor)
- **URL**: https://github.com/theatre-js/theatre
- **Tech**: JavaScript/TypeScript
- **Stars**: 11k+
- **Key Features**:
  - Visual animation editor
  - Keyframe-based
  - Works with Three.js, React, vanilla JS
- **Why Useful**: Complex choreographed scroll sequences

---

## 7. TYPOGRAPHY & FONT RECOMMENDATIONS

### For LeBron's "King" Theme:
```css
/* Display/Headers - Elegant, powerful */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&display=swap');

/* Body - Clean, modern */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

/* Stats/Numbers - Monospace feel */
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');

h1, h2, .headline {
  font-family: 'Playfair Display', serif;
  font-weight: 900;
}

body {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
}

.stat-number {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  color: var(--gold-primary);
}
```

---

## 8. PERFORMANCE TIPS

1. **Use `will-change` sparingly** - only on elements about to animate
2. **Prefer `transform` and `opacity`** - GPU accelerated, no layout thrashing
3. **Use `requestAnimationFrame`** for canvas animations
4. **Lazy load images** with `loading="lazy"` or IntersectionObserver
5. **Debounce scroll handlers** - use passive event listeners
6. **Canvas optimizations**: Use `offscreenCanvas` for particle calculations
7. **Font loading**: Use `font-display: swap` to avoid FOIT

```css
/* Passive scroll optimization */
html {
  scroll-behavior: smooth; /* Only if not using Lenis */
}

/* GPU layer promotion for animated elements */
.animate-on-scroll {
  will-change: transform, opacity;
  transform: translateZ(0); /* Force GPU layer */
}
```

---

## 9. RECOMMENDED TECH STACK FOR LEBRON WEBSITE

Based on research, the ideal stack is:

| Layer | Technology | Reason |
|-------|-----------|--------|
| Framework | Next.js (React) | SSR, performance, ecosystem |
| Smooth Scroll | Lenis | Buttery smooth, GSAP integration |
| Scroll Animation | GSAP + ScrollTrigger | Industry standard, scrub mode |
| Particles | tsParticles or Canvas 2D | Lightweight, customizable |
| 3D Elements | Three.js (if needed) | WebGL particle effects |
| Transitions | Framer Motion | React-native animations |
| Typography | Playfair Display + Inter | Elegant + readable |
| Styling | Tailwind CSS + CSS vars | Rapid development + custom theme |

---

## 10. QUICK REFERENCE: KEY CSS TECHNIQUES

### Scroll-snap for Section-based Navigation
```css
.scroll-container {
  scroll-snap-type: y mandatory;
  overflow-y: scroll;
  height: 100vh;
}

.section {
  scroll-snap-align: start;
  height: 100vh;
}
```

### Parallax with CSS only (simple)
```css
.parallax {
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
```

### Animated Gold Underline
```css
.gold-underline {
  position: relative;
  display: inline-block;
}

.gold-underline::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #c9a84c, #f0d68a);
  transition: width 0.4s ease;
}

.gold-underline:hover::after {
  width: 100%;
}
```

### Loading Screen with Gold Spinner
```css
.loader {
  width: 40px;
  height: 40px;
  border: 3px solid #1a1a1a;
  border-top: 3px solid #c9a84c;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

---

*This document serves as a design system reference for the LeBron James tribute website project.*
