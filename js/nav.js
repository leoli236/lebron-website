/* ============================================
   NAV — 导航栏滚动行为
   ============================================ */
(function() {
  var nav = document.getElementById('nav');
  if (!nav) return;
  window.addEventListener('scroll', function() {
    nav.classList.toggle('scrolled', window.scrollY > 80);
  });
})();
