/* ============================================
   LIGHTBOX — 图片灯箱组件
   ============================================ */
(function() {
  // 自动创建 DOM
  var lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.id = 'lb';
  lb.innerHTML = '<div class="lb-close">&times;</div><img id="lb-img" src=""><div class="lb-caption" id="lb-cap"></div>';
  document.body.appendChild(lb);

  lb.addEventListener('click', function(e) {
    if (e.target !== document.getElementById('lb-img')) closeLB();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeLB();
  });
})();

function openLB(src, caption) {
  var lb = document.getElementById('lb');
  lb.classList.add('open');
  document.getElementById('lb-img').src = src;
  document.getElementById('lb-cap').textContent = caption || '';
  document.body.style.overflow = 'hidden';
}

function closeLB() {
  document.getElementById('lb').classList.remove('open');
  document.body.style.overflow = '';
}
