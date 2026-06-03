/* ============================================
   PARTICLES — Canvas 金色粒子背景
   ============================================ */
(function() {
  var canvas = document.getElementById('river-canvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var parts = [];
  var paused = false;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (var i = 0; i < 40; i++) {
    parts.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.2,
      vy: Math.random() * 0.3 + 0.1,
      r: Math.random() * 2 + 0.5,
      a: Math.random() * 0.15 + 0.03
    });
  }

  function draw() {
    if (!paused) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      parts.forEach(function(p) {
        p.x += p.vx + Math.sin(p.y * 0.005) * 0.3;
        p.y += p.vy;
        if (p.y > canvas.height) {
          p.y = -10;
          p.x = Math.random() * canvas.width;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(201,168,76,' + p.a + ')';
        ctx.fill();
      });
    }
    requestAnimationFrame(draw);
  }
  draw();

  document.addEventListener('visibilitychange', function() {
    paused = document.hidden;
  });
})();
