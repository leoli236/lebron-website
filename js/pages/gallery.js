/* ============================================
   GALLERY — 独立画廊页逻辑
   ============================================ */
LeBronData.load().then(function(d) {
  if (!d) return;
  var imgs = d.images || {};
  var cats = [
    {k:'all',l:'全部',d:'完整影像索引'},
    {k:'childhood',l:'阿克伦',d:'源头与早期记忆'},
    {k:'high_school',l:'高中',d:'天选之子的开端'},
    {k:'cleveland_first',l:'骑士初期',d:'一座城的少年国王'},
    {k:'the_decision',l:'热火',d:'急流、争议与救赎'},
    {k:'cleveland_return',l:'回家',d:'承诺与克利夫兰'},
    {k:'2016_championship',l:'2016夺冠',d:'The Block 与城市解放'},
    {k:'lakers',l:'湖人',d:'紫金舞台与新的冠军'},
    {k:'scoring_record',l:'纪录',d:'历史得分王之路'},
    {k:'community',l:'公益',d:'I PROMISE 与影响力'},
    {k:'fan_art',l:'精选',d:'时代同框与球迷记忆'}
  ];
  var all = Object.entries(imgs).flatMap(function(entry) {
    return entry[1].map(function(u) { return { c: entry[0], u: u }; });
  });

  function render(f) {
    var list = f === 'all' ? all : all.filter(function(i) { return i.c === f; });
    var meta = cats.find(function(c) { return c.k === f; }) || cats[0];
    document.getElementById('st').textContent = meta.d + ' · 共 ' + list.length + ' 张图片';
    document.getElementById('g').innerHTML = list.map(function(img, i) {
      var cls = i % 7 === 0 ? 'wide' : (i % 11 === 0 ? 'tall' : '');
      var label = (cats.find(function(c) { return c.k === img.c; }) || {}).l || 'LeBron';
      return '<div class="gi ' + cls + '" onclick="openLB(\'' + img.u + '\',\'LeBron James · ' + label + '\')">' +
        '<img src="' + img.u + '" alt="LeBron James ' + label + '影像" loading="lazy" onerror="this.parentElement.style.display=\'none\'">' +
        '<div class="ov"><span>' + label + '<br>点击放大</span></div></div>';
    }).join('');
  }
  window.render = render;

  document.getElementById('f').innerHTML = cats.map(function(c) {
    return '<button class="' + (c.k === 'all' ? 'active' : '') + '" onclick="document.querySelectorAll(\'#f button\').forEach(function(b){b.classList.remove(\'active\')});this.classList.add(\'active\');render(\'' + c.k + '\')">' + c.l + '</button>';
  }).join('');
  render('all');
});
