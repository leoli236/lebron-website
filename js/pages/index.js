/* ============================================
   INDEX — 主页逻辑
   ============================================ */
LeBronData.load().then(function(d) {
  if (!d) return;
  var imgs = d.images || {};

  // ---- RIVER NODES ----
  var imgMap = ['childhood','high_school','cleveland_first','the_decision','cleveland_return','lakers','scoring_record'];
  var moodEmoji = { struggle: '🔥', hope: '🌊', triumph: '👑', legacy: '⭐' };
  document.getElementById('river-nodes').innerHTML = d.timeline.map(function(item, i) {
    var m = item.mood || 'triumph';
    var cat = imgMap[i] || '';
    var imgSrc = (imgs[cat] || [])[0] || '';
    var moodL = { struggle: '挣扎', hope: '希望', triumph: '荣耀', legacy: '传奇' }[m];
    var imgHTML = imgSrc
      ? '<img class="node-img" src="' + imgSrc + '" alt="' + item.title + '" loading="lazy" onclick="event.stopPropagation();openLB(\'' + imgSrc + '\',\'' + item.title + '\')" onerror="this.outerHTML=\'<div class=node-img-fallback>' + moodEmoji[m] + '</div>\'">'
      : '<div class="node-img-fallback">' + moodEmoji[m] + '</div>';
    return '<div class="river-node">' +
      '<div class="node-dot"></div>' +
      '<div class="node-year">' + item.year + '</div>' +
      '<div class="node-card"><div class="node-card-inner">' +
        imgHTML +
        '<div class="node-body">' +
          '<div class="node-mood m-' + m + '">' + moodL + '</div>' +
          '<div class="node-title">' + item.title + '</div>' +
          '<div class="node-excerpt">' + item.story.substring(0, 130) + '...</div>' +
          '<div class="node-quote">"' + item.quote + '"</div>' +
          '<div class="node-expand" id="ne-' + i + '">' +
            '<div class="node-full">' + item.story + '</div>' +
            '<div class="node-tags st">' + item.struggles.map(function(s) { return '<span>' + s + '</span>'; }).join('') + '</div>' +
            '<div class="node-tags tr" style="margin-top:8px">' + item.triumphs.map(function(t) { return '<span>' + t + '</span>'; }).join('') + '</div>' +
          '</div>' +
        '</div>' +
      '</div></div>' +
    '</div>';
  }).join('');

  // Click to expand
  document.querySelectorAll('.node-card-inner').forEach(function(card, i) {
    card.style.cursor = 'pointer';
    card.addEventListener('click', function() {
      var el = document.getElementById('ne-' + i);
      if (el) el.classList.toggle('open');
    });
  });

  // ---- RIVALS ----
  document.getElementById('rivals-grid').innerHTML = (d.rivals || []).map(function(r) {
    return '<div class="rival-card fade-in">' +
      '<img class="rival-img" src="' + r.image + '" alt="' + r.chinese + '" loading="lazy" onclick="openLB(\'' + r.image + '\',\'' + r.chinese + '\')" onerror="this.style.display=\'none\'">' +
      '<div class="rival-body">' +
        '<div class="r-name">' + r.chinese + '</div>' +
        '<div class="r-era">' + r.era + ' · ' + r.name + '</div>' +
        '<div class="r-rel">' + r.relationship + '</div>' +
        '<div class="r-story">' + r.story.substring(0, 120) + '...</div>' +
        '<div class="r-battles">' + r.battles.map(function(b) { return '<span>' + b + '</span>'; }).join('') + '</div>' +
        '<div class="r-quote">"' + r.quote + '"</div>' +
      '</div>' +
    '</div>';
  }).join('');

  // ---- GALLERY ----
  var gcats = [
    {k:'all',l:'全部'},{k:'cleveland_first',l:'骑士'},{k:'the_decision',l:'热火'},
    {k:'cleveland_return',l:'回归'},{k:'2016_championship',l:'夺冠'},
    {k:'lakers',l:'湖人'},{k:'scoring_record',l:'纪录'}
  ];
  var allI = Object.entries(imgs).flatMap(function(entry) {
    return entry[1].map(function(u) { return { c: entry[0], u: u }; });
  });
  function renderG(f) {
    var list = f === 'all' ? allI : allI.filter(function(i) { return i.c === f; });
    document.getElementById('gg').innerHTML = list.map(function(img, i) {
      return '<div class="gi ' + (i % 5 === 0 ? 'wide' : '') + '" onclick="openLB(\'' + img.u + '\',\'LeBron James\')">' +
        '<img src="' + img.u + '" alt="" loading="lazy" onerror="this.parentElement.style.display=\'none\'">' +
        '<div class="gi-ov"><span>🔍</span></div></div>';
    }).join('');
  }
  document.getElementById('gf').innerHTML = gcats.map(function(c) {
    return '<button class="' + (c.k === 'all' ? 'active' : '') + '" onclick="document.querySelectorAll(\'#gf button\').forEach(function(b){b.classList.remove(\'active\')});this.classList.add(\'active\');renderG(\'' + c.k + '\')">' + c.l + '</button>';
  }).join('');
  renderG('all');

  // ---- QUOTES ----
  var rots = [-2, 1.5, -1, 2.5, -3, 1, -1.5, 2, -2.5, 3];
  document.getElementById('qw').innerHTML = d.quotes.map(function(q, i) {
    return '<div class="q-card" style="--r:' + rots[i % 10] + 'deg"><div class="qi">❝</div><q>' + q.text + '</q><div class="qc">' + q.context + '</div></div>';
  }).join('');

  // ---- SCROLL ANIMATION (动态元素) ----
  // 数据异步加载的元素需要单独注册 observer
  var revealObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  // 注册河流节点
  document.querySelectorAll('.river-node').forEach(function(el) {
    revealObs.observe(el);
  });
  // 注册宿敌卡片
  document.querySelectorAll('.rival-card.fade-in').forEach(function(el) {
    revealObs.observe(el);
  });

  console.log('[index] observer registered for',
    document.querySelectorAll('.river-node').length, 'nodes,',
    document.querySelectorAll('.rival-card.fade-in').length, 'rivals');

  // ---- RIVER SVG ANIMATION ----
  if (window.RiverAnim) RiverAnim.init();
});
