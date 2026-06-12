/* ============================================
   RIVALS — 宿敌详情页逻辑
   ============================================ */
LeBronData.load().then(function(d) {
  if (!d) return;
  var rivals = d.rivals || [];

  // Rival nav dots
  document.getElementById('rn').innerHTML = rivals.map(function(r, i) {
    return '<a href="#rv-' + i + '" title="' + r.chinese + '"></a>';
  }).join('');

  // Rival details
  document.getElementById('rivals-container').innerHTML = rivals.map(function(r, i) {
    var years = r.battles.map(function(b) {
      var m = b.match(/(\d{4})/);
      return m ? m[1] : '';
    });
    return '<section class="rival-detail" id="rv-' + i + '">' +
      '<div class="rd-inner">' +
        '<div class="rd-img" data-file="RIVAL FILE ' + String(i + 1).padStart(2, '0') + '" onclick="openLB(\'' + r.image + '\',\'' + r.chinese + '\')">' +
          '<img src="' + r.image + '" alt="' + r.chinese + '" loading="lazy" onerror="this.outerHTML=\'<div class=rd-fallback>' + r.chinese + '<span>' + r.name + '</span></div>\'">' +
          '<div class="rd-overlay"><span>点击放大</span></div>' +
        '</div>' +
        '<div class="rd-content">' +
          '<div class="rd-index">CASE ' + String(i + 1).padStart(2, '0') + ' / ' + rivals.length + '</div>' +
          '<div class="rd-era">' + r.era + '</div>' +
          '<div class="rd-name">' + r.chinese + '</div>' +
          '<div class="rd-en">' + r.name + '</div>' +
          '<div class="rd-rel">' + r.relationship + '</div>' +
          '<div class="rd-story">' + r.story + '</div>' +
          '<div class="rd-battles">' +
            '<h4>经典对决</h4>' +
            r.battles.map(function(b, j) {
              return '<div class="rd-battle"><div class="rb-year">' + (years[j] || '') + '</div><div class="rb-text">' + b + '</div></div>';
            }).join('') +
          '</div>' +
          '<div class="rd-quote">"' + r.quote + '"</div>' +
        '</div>' +
      '</div>' +
    '</section>';
  }).join('');

  // Scroll effects
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        var id = e.target.id;
        document.querySelectorAll('.rival-nav a').forEach(function(a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.rival-detail').forEach(function(el) { obs.observe(el); });
});
