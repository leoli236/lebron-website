/* ============================================
   GALLERY — 独立画廊页逻辑
   ============================================ */
LeBronData.load().then(function(d) {
  if (!d) return;
  var imgs = d.images || {};
  var cats = [
    {k:'all',l:'全部'},{k:'childhood',l:'童年'},{k:'high_school',l:'高中'},
    {k:'cleveland_first',l:'骑士初期'},{k:'the_decision',l:'热火'},
    {k:'cleveland_return',l:'回归骑士'},{k:'2016_championship',l:'2016夺冠'},
    {k:'lakers',l:'湖人'},{k:'scoring_record',l:'纪录'},
    {k:'community',l:'社区'},{k:'fan_art',l:'精选'}
  ];
  var all = Object.entries(imgs).flatMap(function(entry) {
    return entry[1].map(function(u) { return { c: entry[0], u: u }; });
  });

  function render(f) {
    var list = f === 'all' ? all : all.filter(function(i) { return i.c === f; });
    document.getElementById('st').textContent = '共 ' + list.length + ' 张图片';
    document.getElementById('g').innerHTML = list.map(function(img, i) {
      var cls = i % 7 === 0 ? 'wide' : (i % 11 === 0 ? 'tall' : '');
      return '<div class="gi ' + cls + '" onclick="openLB(\'' + img.u + '\')">' +
        '<img src="' + img.u + '" alt="" loading="lazy" onerror="this.parentElement.style.display=\'none\'">' +
        '<div class="ov"><span>🔍 点击放大</span></div></div>';
    }).join('');
  }

  document.getElementById('f').innerHTML = cats.map(function(c) {
    return '<button class="' + (c.k === 'all' ? 'active' : '') + '" onclick="document.querySelectorAll(\'#f button\').forEach(function(b){b.classList.remove(\'active\')});this.classList.add(\'active\');render(\'' + c.k + '\')">' + c.l + '</button>';
  }).join('');
  render('all');
});
