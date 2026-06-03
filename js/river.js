/* ============================================
   RIVER — 河流 SVG 路径动画
   ============================================ */
window.RiverAnim = (function() {
  var svg = document.getElementById('river-svg');
  if (!svg) return { init: function() {} };

  function initRiver() {
    var container = svg.parentElement;
    var nodes = container.querySelectorAll('.river-node');
    if (nodes.length === 0) return;

    var containerRect = container.getBoundingClientRect();

    // 收集每个节点的 dot 位置（相对于 river-path 容器）
    var points = [];
    nodes.forEach(function(node) {
      var dot = node.querySelector('.node-dot');
      if (dot) {
        var r = dot.getBoundingClientRect();
        points.push({
          x: r.left + r.width / 2 - containerRect.left,
          y: r.top + r.height / 2 - containerRect.top
        });
      }
    });

    if (points.length < 2) return;

    // 生成平滑的贝塞尔曲线路径
    var pathD = 'M ' + points[0].x + ',' + points[0].y;
    for (var i = 1; i < points.length; i++) {
      var prev = points[i - 1];
      var curr = points[i];
      var cpY = (prev.y + curr.y) / 2;
      pathD += ' C ' + prev.x + ',' + cpY + ' ' + curr.x + ',' + cpY + ' ' + curr.x + ',' + curr.y;
    }

    // 设置 SVG 尺寸
    svg.setAttribute('width', containerRect.width);
    svg.setAttribute('height', containerRect.height);
    svg.style.width = containerRect.width + 'px';
    svg.style.height = containerRect.height + 'px';

    // 主线
    var flowLine = svg.querySelector('.river-flow-line');
    flowLine.setAttribute('d', pathD);
    var lineLen = flowLine.getTotalLength();
    flowLine.style.strokeDasharray = lineLen;
    flowLine.style.strokeDashoffset = lineLen;
    flowLine.style.transition = 'stroke-dashoffset 2s ease';

    // 宽光晕线
    var flowFill = svg.querySelector('.river-flow-fill');
    flowFill.setAttribute('d', pathD);
    var fillLen = flowFill.getTotalLength();
    flowFill.style.strokeDasharray = fillLen;
    flowFill.style.strokeDashoffset = fillLen;
    flowFill.style.transition = 'stroke-dashoffset 2.5s ease';

    // IntersectionObserver 触发动画
    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          flowLine.style.strokeDashoffset = '0';
          flowFill.style.strokeDashoffset = '0';
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    obs.observe(container);

    // 节点涟漪效果
    nodes.forEach(function(node) {
      var dot = node.querySelector('.node-dot');
      if (!dot) return;
      var nodeObs = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) {
          if (e.isIntersecting) {
            dot.classList.add('ripple');
            nodeObs.unobserve(e.target);
          }
        });
      }, { threshold: 0.3 });
      nodeObs.observe(node);
    });
  }

  // 窗口大小变化时重新计算
  var resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(initRiver, 300);
  });

  return { init: initRiver };
})();
