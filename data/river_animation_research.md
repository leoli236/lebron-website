# 河流/路径动画技术研究

> 搜索时间: 2026-05-20
> 目标: 实现LeBron时间线河流动画效果

---

## 一、SVG Path动画 - 河流流动效果

### 1.1 核心技术: SVG stroke-dashoffset 动画

这是最经典的SVG路径"绘制"动画技术，通过虚线偏移模拟画笔描边效果。

```html
<svg width="800" height="200">
  <path id="river-path" 
        d="M0,100 C200,50 400,150 600,80 S800,120 1000,100"
        fill="none" 
        stroke="#4A90D9" 
        stroke-width="4"
        stroke-dasharray="2000"
        stroke-dashoffset="2000" />
</svg>

<style>
  #river-path {
    animation: flow 3s ease forwards;
  }
  @keyframes flow {
    to { stroke-dashoffset: 0; }
  }
</style>
```

**关键属性:**
- `stroke-dasharray`: 定义虚线段长度（设为路径总长）
- `stroke-dashoffset`: 控制偏移量，从总长动画到0 = 画笔效果

### 1.2 参考项目: Vivus.js
- **GitHub**: https://github.com/maxwellito/vivus
- **Stars**: 14k+
- **描述**: 轻量级SVG绘制动画库，支持多种动画类型
- **核心API**:
```javascript
new Vivus('my-svg', {
  type: 'delayed',      // 动画类型: delayed/sync/oneByOne/scenario
  duration: 200,        // 动画时长(帧数)
  animTimingFunction: Vivus.EASE
}, callback);
```

### 1.3 参考项目: Lazy Line Painter
- **GitHub**: https://github.com/camoconnell/lazy-line-painter
- **描述**: SVG路径动画jQuery插件，适合手绘风格
- **用法**:
```javascript
$('#river-svg').lazylinepainter({
  svgData: paths,
  strokeColor: '#4A90D9',
  strokeWidth: 3,
  ease: 'easeInOut',
  speed: 30
}).lazylinepainter('paint');
```

### 1.4 河流流动感增强 - 多层路径 + 透明度波浪

```javascript
// 多条路径模拟河流深度层次
const riverPaths = [
  { d: 'M0,100 Q250,60 500,100 T1000,100', width: 20, opacity: 0.3, color: '#1a5276' },
  { d: 'M0,105 Q250,65 500,105 T1000,105', width: 12, opacity: 0.5, color: '#2980b9' },
  { d: 'M0,102 Q250,70 500,102 T1000,102', width: 6,  opacity: 0.8, color: '#5dade2' },
];

// 每条路径有不同的动画延迟，产生流动波纹
riverPaths.forEach((p, i) => {
  const path = createSVGPath(p);
  const length = path.getTotalLength();
  path.style.strokeDasharray = length;
  path.style.strokeDashoffset = length;
  path.style.animation = `flowRiver 2s ${i * 0.3}s ease forwards`;
});
```

---

## 二、Canvas粒子跟随路径流动

### 2.1 核心技术: getPointOnPath / 沿贝塞尔曲线采样

```javascript
class RiverParticle {
  constructor(pathPoints) {
    this.pathPoints = pathPoints; // 预计算的路径点数组
    this.progress = 0;           // 0~1 在路径上的位置
    this.speed = 0.002 + Math.random() * 0.003;
    this.size = 1 + Math.random() * 3;
    this.opacity = 0.3 + Math.random() * 0.7;
    this.offset = (Math.random() - 0.5) * 20; // 横向偏移，模拟河流宽度
  }

  update() {
    this.progress += this.speed;
    if (this.progress >= 1) this.progress = 0;
  }

  draw(ctx) {
    const index = Math.floor(this.progress * (this.pathPoints.length - 1));
    const point = this.pathPoints[index];
    
    // 计算路径法线方向，用于横向偏移
    const next = this.pathPoints[Math.min(index + 1, this.pathPoints.length - 1)];
    const angle = Math.atan2(next.y - point.y, next.x - point.x);
    const perpAngle = angle + Math.PI / 2;
    
    const x = point.x + Math.cos(perpAngle) * this.offset;
    const y = point.y + Math.sin(perpAngle) * this.offset;

    ctx.beginPath();
    ctx.arc(x, y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(74, 144, 217, ${this.opacity})`;
    ctx.fill();
  }
}
```

### 2.2 参考项目: particles.js
- **GitHub**: https://github.com/VincentGarreau/particles.js
- **Stars**: 28k+
- **描述**: 经典粒子库，可改造为沿路径流动

### 2.3 参考项目: tsParticles
- **GitHub**: https://github.com/tsparticles/tsparticles
- **Stars**: 7k+
- **描述**: particles.js的现代化重写，支持路径运动器

### 2.4 沿SVG路径生成Canvas粒子

```javascript
// 从SVG路径提取点
function getPathPoints(svgPathElement, numPoints = 200) {
  const length = svgPathElement.getTotalLength();
  const points = [];
  for (let i = 0; i <= numPoints; i++) {
    const point = svgPathElement.getPointAtLength((i / numPoints) * length);
    points.push({ x: point.x, y: point.y });
  }
  return points;
}

// Canvas渲染循环
class RiverCanvas {
  constructor(canvas, svgPath) {
    this.ctx = canvas.getContext('2d');
    this.pathPoints = getPathPoints(svgPath);
    this.particles = [];
    this.initParticles(150);
    this.animate();
  }

  initParticles(count) {
    for (let i = 0; i < count; i++) {
      this.particles.push(new RiverParticle(this.pathPoints));
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    
    // 绘制河流背景（粗线条）
    this.drawRiverBed();
    
    // 绘制流动粒子
    this.particles.forEach(p => {
      p.update();
      p.draw(this.ctx);
    });
    
    requestAnimationFrame(() => this.animate());
  }

  drawRiverBed() {
    this.ctx.beginPath();
    this.pathPoints.forEach((p, i) => {
      if (i === 0) this.ctx.moveTo(p.x, p.y);
      else this.ctx.lineTo(p.x, p.y);
    });
    this.ctx.strokeStyle = 'rgba(74, 144, 217, 0.2)';
    this.ctx.lineWidth = 30;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.stroke();
  }
}
```

### 2.5 高级粒子效果: 水滴/气泡粒子

```javascript
class BubbleParticle extends RiverParticle {
  draw(ctx) {
    const index = Math.floor(this.progress * (this.pathPoints.length - 1));
    const point = this.pathPoints[index];
    const next = this.pathPoints[Math.min(index + 1, this.pathPoints.length - 1)];
    const angle = Math.atan2(next.y - point.y, next.x - point.x);
    const perpAngle = angle + Math.PI / 2;
    
    // 加入sin波动，模拟水面起伏
    const wave = Math.sin(this.progress * 20 + Date.now() * 0.003) * 5;
    const x = point.x + Math.cos(perpAngle) * (this.offset + wave);
    const y = point.y + Math.sin(perpAngle) * (this.offset + wave);

    // 气泡效果
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, this.size);
    gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity * 0.8})`);
    gradient.addColorStop(1, `rgba(74, 144, 217, 0)`);
    
    ctx.beginPath();
    ctx.arc(x, y, this.size * 2, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
  }
}
```

---

## 三、滚动驱动的路径动画 (Scroll-Driven Path Animation)

### 3.1 核心技术: scroll progress → stroke-dashoffset

```javascript
// 监听滚动，驱动SVG路径绘制进度
function scrollDrivenPathAnimation(svgPath, triggerElement) {
  const pathLength = svgPath.getTotalLength();
  
  // 初始化：路径完全隐藏
  svgPath.style.strokeDasharray = pathLength;
  svgPath.style.strokeDashoffset = pathLength;

  window.addEventListener('scroll', () => {
    const rect = triggerElement.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // 计算滚动进度 0~1
    const scrollProgress = Math.max(0, Math.min(1,
      (windowHeight - rect.top) / (windowHeight + rect.height)
    ));
    
    // 滚动进度 → 路径偏移
    svgPath.style.strokeDashoffset = pathLength * (1 - scrollProgress);
  });
}
```

### 3.2 参考项目: ScrollMagic
- **GitHub**: https://github.com/janpaepke/ScrollMagic
- **Stars**: 14.5k+
- **描述**: 最流行的滚动驱动动画库
- **核心用法**:
```javascript
const controller = new ScrollMagic.Controller();
const scene = new ScrollMagic.Scene({
  triggerElement: '#river-section',
  duration: '100%',      // 动画持续的滚动距离
  triggerHook: 0.5        // 触发位置
})
.setTween('#river-path', { strokeDashoffset: 0 })
.addTo(controller);
```

### 3.3 参考项目: GSAP ScrollTrigger
- **GitHub**: https://github.com/greensock/GSAP (ScrollTrigger内置于GSAP)
- **Stars**: 19k+
- **描述**: 性能最好的滚动动画方案
- **核心用法**:
```javascript
gsap.registerPlugin(ScrollTrigger);

// 河流路径随滚动绘制
const riverPath = document.querySelector('#river-path');
const pathLength = riverPath.getTotalLength();

gsap.set(riverPath, { strokeDasharray: pathLength });

gsap.to(riverPath, {
  strokeDashoffset: 0,
  ease: 'none',
  scrollTrigger: {
    trigger: '.timeline-section',
    start: 'top center',
    end: 'bottom center',
    scrub: 1,             // 平滑跟随滚动
    onUpdate: (self) => {
      // 可在此处触发节点高亮等交互
      updateNodeHighlights(self.progress);
    }
  }
});

// 沿路径的节点随滚动逐个出现
gsap.utils.toArray('.timeline-node').forEach((node, i) => {
  gsap.from(node, {
    opacity: 0,
    scale: 0,
    scrollTrigger: {
      trigger: node,
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    },
    duration: 0.6,
    delay: i * 0.1
  });
});
```

### 3.4 参考项目: Locomotive Scroll
- **GitHub**: https://github.com/locomotivemtl/locomotive-scroll
- **Stars**: 6.5k+
- **描述**: 平滑滚动库，配合ScrollMagic/GSAP使用效果极佳

### 3.5 参考项目: AOS (Animate On Scroll)
- **GitHub**: https://github.com/michalsnik/aos
- **Stars**: 26k+
- **描述**: 轻量级滚动动画库，适合简单的元素出现效果

### 3.6 原生CSS Scroll-Driven Animations (2024+ 新特性)

```css
/* 现代浏览器支持的原生滚动驱动动画 */
@keyframes drawRiver {
  from { stroke-dashoffset: var(--path-length); }
  to { stroke-dashoffset: 0; }
}

#river-path {
  stroke-dasharray: var(--path-length);
  animation: drawRiver linear;
  animation-timeline: scroll();  /* 绑定到页面滚动 */
  animation-range: 0% 100%;
}
```

### 3.7 参考项目: Motion One
- **GitHub**: https://github.com/motiondivision/motion-one
- **Stars**: 3k+
- **描述**: 现代动画库，支持滚动触发和时间线
- **用法**:
```javascript
import { scroll, animate } from 'motion';

scroll(
  animate('#river-path', { strokeDashoffset: 0 }),
  { target: document.querySelector('.timeline') }
);
```

---

## 四、河流节点交互效果

### 4.1 节点定位: getPointAtLength 沿路径定位

```javascript
// 在SVG路径的特定位置放置节点
function placeNodeOnPath(pathElement, progress) {
  const length = pathElement.getTotalLength();
  const point = pathElement.getPointAtLength(length * progress);
  return { x: point.x, y: point.y };
}

// 在路径上均匀放置节点
const nodeCount = 10;
for (let i = 0; i < nodeCount; i++) {
  const progress = i / (nodeCount - 1);
  const { x, y } = placeNodeOnPath(riverPath, progress);
  
  // 创建节点圆圈
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', x);
  circle.setAttribute('cy', y);
  circle.setAttribute('r', '8');
  circle.setAttribute('class', 'timeline-node');
  circle.setAttribute('data-index', i);
  svg.appendChild(circle);
}
```

### 4.2 节点脉冲动画 (CSS)

```css
.timeline-node {
  fill: #fff;
  stroke: #4A90D9;
  stroke-width: 3;
  cursor: pointer;
  transition: all 0.3s ease;
}

.timeline-node:hover {
  transform: scale(1.5);
  fill: #4A90D9;
}

.timeline-node.active {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { r: 8; stroke-opacity: 1; }
  50% { r: 14; stroke-opacity: 0.5; }
  100% { r: 8; stroke-opacity: 1; }
}

/* 节点涟漪效果 */
.timeline-node::after {
  content: '';
  /* 需要用SVG filter实现 */
}
```

### 4.3 节点涟漪SVG效果

```html
<svg>
  <defs>
    <filter id="ripple">
      <feGaussianBlur in="SourceGraphic" stdDeviation="0">
        <animate attributeName="stdDeviation" 
                 from="0" to="20" dur="1.5s" 
                 repeatCount="indefinite" />
      </feGaussianBlur>
    </filter>
  </defs>
  
  <!-- 涟漪圈 -->
  <circle cx="100" cy="100" r="8" fill="none" stroke="#4A90D9" 
          stroke-width="2" opacity="1">
    <animate attributeName="r" from="8" to="30" dur="2s" repeatCount="indefinite" />
    <animate attributeName="opacity" from="0.8" to="0" dur="2s" repeatCount="indefinite" />
  </circle>
</svg>
```

### 4.4 节点悬浮卡片交互

```javascript
class TimelineNode {
  constructor(svg, pathElement, progress, data) {
    this.data = data; // { year, title, description, image }
    
    const length = pathElement.getTotalLength();
    const point = pathElement.getPointAtLength(length * progress);
    
    // 创建SVG元素
    this.group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.group.classList.add('node-group');
    this.group.style.transform = `translate(${point.x}px, ${point.y}px)`;
    
    // 节点圆圈
    this.circle = this.createCircle(8);
    this.group.appendChild(this.circle);
    
    // 涟漪效果
    this.ripple = this.createCircle(8);
    this.ripple.classList.add('ripple');
    this.group.appendChild(this.ripple);
    
    svg.appendChild(this.group);
    
    // 事件绑定
    this.group.addEventListener('mouseenter', () => this.showCard());
    this.group.addEventListener('mouseleave', () => this.hideCard());
    this.group.addEventListener('click', () => this.openDetail());
  }

  showCard() {
    // 显示浮动信息卡片
    const card = document.getElementById('hover-card');
    card.innerHTML = `
      <h3>${this.data.year}</h3>
      <h4>${this.data.title}</h4>
      <p>${this.data.description}</p>
    `;
    card.style.display = 'block';
    // 定位到节点上方
    card.style.left = `${this.point.x}px`;
    card.style.top = `${this.point.y - 120}px`;
  }
}
```

### 4.5 参考项目: D3.js
- **GitHub**: https://github.com/d3/d3
- **Stars**: 109k+
- **描述**: 数据驱动的文档操作库，SVG操作的行业标准
- **关键功能**:
```javascript
// 生成平滑河流曲线
const line = d3.line()
  .curve(d3.curveBasis)       // 贝塞尔平滑
  .x(d => xScale(d.date))
  .y(d => yScale(d.value));

// 路径动画
const path = svg.append('path')
  .datum(data)
  .attr('d', line)
  .attr('fill', 'none')
  .attr('stroke', '#4A90D9');

const totalLength = path.node().getTotalLength();
path.attr('stroke-dasharray', totalLength)
    .attr('stroke-dashoffset', totalLength)
    .transition()
    .duration(3000)
    .attr('stroke-dashoffset', 0);

// 沿路径运动的小球
function animateAlongPath(circle, path) {
  const length = path.getTotalLength();
  circle.transition()
    .duration(5000)
    .attrTween('transform', function() {
      return function(t) {
        const p = path.getPointAtLength(t * length);
        return `translate(${p.x},${p.y})`;
      };
    });
}
```

---

## 五、综合方案推荐

### 方案A: GSAP + SVG (推荐 ⭐)

**优点**: 性能最好、API优雅、社区资源丰富、ScrollTrigger内置

```javascript
// 完整河流时间线实现
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

class RiverTimeline {
  constructor(container, timelineData) {
    this.container = container;
    this.data = timelineData;
    this.svg = this.createSVG();
    this.riverPath = this.createRiverPath();
    this.nodes = [];
    
    this.setupScrollAnimation();
    this.createNodes();
  }

  createRiverPath() {
    // 生成蜿蜒的河流路径
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', this.generateRiverCurve());
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'url(#riverGradient)');
    path.setAttribute('stroke-width', '30');
    path.setAttribute('stroke-linecap', 'round');
    this.svg.appendChild(path);
    return path;
  }

  generateRiverCurve() {
    // 根据数据点生成蜿蜒曲线
    const height = this.data.length * 200;
    let d = `M 400,0 `;
    for (let i = 0; i < this.data.length; i++) {
      const y = (i + 1) * (height / this.data.length);
      const x = 400 + (i % 2 === 0 ? 150 : -150); // 左右蜿蜒
      d += `T ${x},${y} `;
    }
    return d;
  }

  setupScrollAnimation() {
    const pathLength = this.riverPath.getTotalLength();
    
    gsap.set(this.riverPath, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength
    });
    
    // 主河流绘制动画
    gsap.to(this.riverPath, {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: this.container,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
        onUpdate: (self) => {
          this.updateActiveNodes(self.progress);
          this.updateParticleFlow(self.progress);
        }
      }
    });
  }

  createNodes() {
    this.data.forEach((item, i) => {
      const progress = (i + 1) / (this.data.length + 1);
      const point = this.riverPath.getPointAtLength(
        progress * this.riverPath.getTotalLength()
      );
      
      const node = new TimelineNode(this.svg, point, item);
      this.nodes.push(node);
      
      // 节点出现动画
      gsap.from(node.element, {
        scale: 0,
        opacity: 0,
        scrollTrigger: {
          trigger: node.element,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      });
    });
  }

  updateActiveNodes(progress) {
    this.nodes.forEach((node, i) => {
      const nodeProgress = (i + 1) / (this.data.length + 1);
      if (progress >= nodeProgress) {
        node.activate();
      } else {
        node.deactivate();
      }
    });
  }
}
```

### 方案B: Canvas粒子 + SVG路径 + IntersectionObserver (轻量)

**优点**: 粒子效果丰富、无外部依赖

```javascript
// 混合方案: SVG定义路径 + Canvas绘制粒子
class RiverAnimation {
  constructor(svgPathSelector, canvasElement) {
    this.path = document.querySelector(svgPathSelector);
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.pathPoints = this.extractPathPoints();
    this.particles = [];
    this.isVisible = false;
    
    this.setupVisibilityObserver();
    this.initParticles();
    this.animate();
  }

  extractPathPoints(numPoints = 300) {
    const length = this.path.getTotalLength();
    return Array.from({ length: numPoints + 1 }, (_, i) => {
      const p = this.path.getPointAtLength((i / numPoints) * length);
      return { x: p.x, y: p.y };
    });
  }

  setupVisibilityObserver() {
    const observer = new IntersectionObserver(
      ([entry]) => { this.isVisible = entry.isIntersecting; },
      { threshold: 0.1 }
    );
    observer.observe(this.canvas);
  }

  initParticles(count = 100) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        progress: Math.random(),
        speed: 0.001 + Math.random() * 0.004,
        size: 1 + Math.random() * 2.5,
        opacity: 0.2 + Math.random() * 0.6,
        offset: (Math.random() - 0.5) * 40
      });
    }
  }

  animate() {
    if (!this.isVisible) {
      requestAnimationFrame(() => this.animate());
      return;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 绘制河流背景
    this.drawRiverBed();
    
    // 绘制流动粒子
    this.particles.forEach(p => {
      p.progress = (p.progress + p.speed) % 1;
      const idx = Math.floor(p.progress * (this.pathPoints.length - 1));
      const pt = this.pathPoints[idx];
      const next = this.pathPoints[Math.min(idx + 1, this.pathPoints.length - 1)];
      const angle = Math.atan2(next.y - pt.y, next.x - pt.x) + Math.PI / 2;
      
      const wave = Math.sin(p.progress * 30 + performance.now() * 0.002) * 3;
      const x = pt.x + Math.cos(angle) * (p.offset + wave);
      const y = pt.y + Math.sin(angle) * (p.offset + wave);
      
      this.ctx.beginPath();
      this.ctx.arc(x, y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(74, 144, 217, ${p.opacity})`;
      this.ctx.fill();
    });
    
    requestAnimationFrame(() => this.animate());
  }
}
```

### 方案C: 纯CSS + 少量JS (最轻量)

**优点**: 无需库、GPU加速、最简单

```html
<svg class="river-svg" viewBox="0 0 800 2000">
  <path class="river-path" 
        d="M400,0 C550,200 250,400 400,600 S550,800 400,1000 S250,1200 400,1400 S550,1600 400,1800"
        fill="none" stroke="#4A90D9" stroke-width="20" />
  
  <!-- 节点 -->
  <circle class="node" cx="400" cy="300" r="10" />
  <circle class="node" cx="325" cy="500" r="10" />
  <circle class="node" cx="400" cy="700" r="10" />
</svg>

<style>
.river-svg {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  height: 100vh;
  pointer-events: none;
}

.river-path {
  stroke-dasharray: 4000;
  stroke-dashoffset: 4000;
  animation: drawRiver linear;
  animation-timeline: scroll();
}

@keyframes drawRiver {
  to { stroke-dashoffset: 0; }
}

.node {
  fill: white;
  stroke: #4A90D9;
  stroke-width: 3;
  scale: 0;
  transition: scale 0.5s;
  /* 用animation-timeline让节点随滚动出现 */
}

.node.visible {
  scale: 1;
  animation: pulse 2s infinite;
}
</style>
```

---

## 六、其他相关参考项目

| 项目 | Stars | 描述 | 链接 |
|------|-------|------|------|
| anime.js | 49k+ | 通用动画库，支持SVG路径追踪 | github.com/juliangarnier/anime |
| mo.js | 18k+ | 运动图形工具包 | github.com/legomushroom/mojs |
| paper.js | 7k+ | Canvas矢量图形框架 | github.com/paperjs/paper.js |
| two.js | 8k+ | 渲染器无关的2D绘图 | github.com/jonobr1/two.js |
| matter.js | 17k+ | 物理引擎，可模拟水流 | github.com/liabru/matter-js |
| skrollr | 18k+ | 滚动动画库(已停更但仍有参考价值) | github.com/Prinzhorn/skrollr |
| ScrollTrigger(GSAP) | - | 最强滚动动画插件 | greensock.com/scrolltrigger |

---

## 七、性能优化建议

1. **使用 `will-change: stroke-dashoffset` 或 `transform`** 触发GPU加速
2. **Canvas使用 `requestAnimationFrame`** 并配合 `IntersectionObserver` 暂停不可见动画
3. **粒子数量控制**: 移动端 < 50, 桌面端 < 200
4. **路径采样点数**: 根据路径长度动态调整，避免过多点计算
5. **使用 OffscreenCanvas** (如支持) 在Web Worker中渲染粒子
6. **SVG用 `contain: layout style`** 避免不必要的重排
7. **滚动事件节流**: 使用 `scrub` (GSAP) 或原生 `scroll-timeline` 代替手动监听scroll

---

## 八、推荐实现路线 (for LeBron Timeline)

```
阶段1: SVG河流路径 + GSAP ScrollTrigger 驱动绘制
  ↓
阶段2: Canvas叠加层添加粒子流动效果
  ↓  
阶段3: 路径上放置LeBron生涯节点 + 交互
  ↓
阶段4: 滚动到节点时展示详细内容卡片
  ↓
阶段5: 性能优化 + 响应式适配
```

**推荐技术栈**: 
- GSAP + ScrollTrigger (滚动驱动)
- SVG (路径定义 + 节点)  
- Canvas (粒子效果叠加)
- 或纯CSS scroll-timeline (如只需现代浏览器支持)
