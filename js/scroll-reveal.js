/* ============================================
   SCROLL REVEAL — IntersectionObserver 淡入
   先用 JS 隐藏元素，再用 observer 逐个显示
   如果 JS 失败，元素默认可见（不会丢失内容）
   ============================================ */
(function() {
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.classList.remove('hidden');
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.05 });

  // 先隐藏，再观察
  var els = document.querySelectorAll('.fade-in');
  els.forEach(function(el) {
    el.classList.add('hidden');
    obs.observe(el);
  });
})();
