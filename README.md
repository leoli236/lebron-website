# 最长的河 — LeBron James 致敬网站

LeBron Raymone James 职业生涯主题致敬网站，以"最长的河"为隐喻，讲述从阿克伦贫民窟到NBA王座的传奇旅程。

## 页面

| 页面 | 说明 |
|------|------|
| `index.html` | 主页：英雄区、数字统计、河流时间线、宿敌、画廊、语录 |
| `journey.html` | 互动旅程：8个章节的沉浸式体验，面对LeBron面对的每一个选择 |
| `rivals.html` | 宿敌详情：9位伟大对手的完整故事 |
| `gallery.html` | 影像画廊：按生涯阶段筛选的图片集 |
| `stats.html` | 数据可视化：生涯得分曲线、里程碑、荣誉墙 |

## 技术栈

- 纯 HTML / CSS / JavaScript，零依赖
- Canvas 2D 粒子效果 + 图表绘制
- IntersectionObserver 滚动动画
- Google Fonts（Playfair Display + Inter + JetBrains Mono）

## 项目结构

```
├── css/
│   ├── base.css          # 共享变量、重置、工具类
│   ├── nav.css           # 导航栏
│   ├── lightbox.css      # 图片灯箱
│   └── pages/            # 页面独有样式
├── js/
│   ├── data.js           # 数据加载 + 缓存
│   ├── nav.js            # 导航栏滚动
│   ├── lightbox.js       # 灯箱组件
│   ├── particles.js      # Canvas 粒子背景
│   ├── counter.js        # 数字滚动动画
│   ├── scroll-reveal.js  # 滚动淡入
│   └── pages/            # 页面独有逻辑
├── data/
│   └── lebron_data.json  # 统一数据源
└── *.html                # 页面文件
```

## 运行

任意静态文件服务器即可：

```bash
# Python
python -m http.server 8000

# Node.js
npx serve .

# 或直接用 VS Code Live Server 插件
```

## 数据来源

- 图片：Wikimedia Commons
- 内容：基于公开资料整理的中文传记内容
