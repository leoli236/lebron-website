/* ============================================
   COUNTER — 数字滚动动画
   ============================================ */
(function() {
  var strip = document.querySelector('.counter-strip');
  if (!strip) return;

  var co = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        document.querySelectorAll('.ci .big').forEach(function(el) {
          var target = parseInt(el.dataset.target);
          var current = 0;
          var step = Math.max(1, Math.floor(target / 60));
          var iv = setInterval(function() {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(iv);
            }
            el.textContent = current.toLocaleString();
          }, 20);
        });
        co.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });

  co.observe(strip);
})();
