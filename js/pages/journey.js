/* ============================================
   JOURNEY — 互动旅程逻辑
   ============================================ */
var D, n = 0, choices = [], emos = [], resolved = [];
var isFinal = false, journeyStarted = false, wheelLock = false, hintTimer = null;

var inters = [
  {type:'choice',
   q:'面对贫困和无家可归的童年，\n你会怎么选择？',
   opts:['放弃，接受命运','把痛苦变成动力，拼命训练'],
   ans:1,
   res:'勒布朗选择了后者。',
   detail:'篮球成了他逃离现实的唯一出口。每天放学后，他在破旧的球场上练习到天黑。汗水冲刷掉生活的苦涩，也锻造了他钢铁般的意志。这是他人生中第一个重要的选择——不向命运低头。'},
  {type:'click',
   q:'在5秒内尽可能快地点击！\n模拟勒布朗高中每天训练8小时的拼劲',
   target:25,
   res:'你点击了{n}次！',
   detail:'勒布朗在高中时每天训练8小时以上。2001年，16岁的他登上Sports Illustrated封面，标题写着"天选之子"。但没人知道，这个少年每天凌晨5点就起床训练。天赋只是起点，努力才是通往伟大的阶梯。'},
  {type:'choice',
   q:'18岁进入NBA，一座城市把希望交给你。\n你会怎么扛住这份重量？',
   opts:['只证明自己，先拿漂亮数据','把城市也背在肩上，带队前进'],
   ans:1,
   res:'勒布朗选择了把城市扛起来。',
   detail:'骑士并不是一支准备好争冠的球队，但他把克利夫兰带进季后赛，带进2007年总决赛。孤胆英雄的代价很重，也让他第一次明白：伟大不能只靠一个人完成。'},
  {type:'choice',
   q:'2010年，你的合同到期了。\n留在克利夫兰可能永远拿不到冠军，\n去迈阿密会被全美骂叛徒。你怎么选？',
   opts:['留队，忠诚比冠军重要','离队，为了总冠军拼一把'],
   ans:-1,
   res:'勒布朗选择了离开。',
   detail:'他在全国电视直播中宣布加盟热火，被全国唾骂，球迷烧了他的球衣。但他说："我做了对自己最好的决定。"有时候，做正确的事比做受欢迎的事更需要勇气。这个决定让他背负了巨大的骂名，但也让他学会了如何在逆境中成长。'},
  {type:'slider',
   q:'2016年总决赛，你1-3落后。\n你还有多少信心能赢？',
   res:'全世界只有0.3%的概率认为骑士能赢。',
   detail:'但勒布朗从未动摇。第五场他在勇士主场砍下41分，第六场又是41分。第七场最后时刻，他送出了一记惊天大帽——"The Block"——封盖的不只是伊戈达拉的上篮，更是克利夫兰52年的诅咒。信心不是盲目乐观，而是对自己能力的绝对信任。'},
  {type:'choice',
   q:'2018年，你已经33岁了。\n去湖人意味着新的挑战和巨大压力。你怎么选？',
   opts:['留在舒适区，安稳打完职业生涯','接受挑战，去湖人书写新传奇'],
   ans:1,
   res:'勒布朗选择了挑战。',
   detail:'第一年他受伤病困扰，很多人说他老了。但2020年科比去世后，他化悲痛为力量，带领湖人夺冠。赛后他说："这是献给科比的。"年龄只是数字，心态决定一切。在最深的悲伤中，他完成了最伟大的致敬。'},
  {type:'text',
   q:'经历了这一切，\n勒布朗教会了你什么？',
   res:'感谢你的分享。',
   detail:'勒布朗的故事告诉我们：出身不决定命运，困难打不倒真正强大的灵魂。他不只是一个篮球运动员——他是证明"一切皆有可能"的活生生的例子。从阿克伦贫民窟到NBA王座，他用22年证明：最长的河，永远向前。'}
];

LeBronData.load().then(function(d) {
  D = d;
  if (!D) return;
  build();
  bindWheel();
});

function build() {
  var c = document.getElementById('chs');
  var imgMap = ['childhood','high_school','cleveland_first','the_decision','cleveland_return','lakers','scoring_record'];
  var imgs = D.images || {};
  D.timeline.forEach(function(item, i) {
    var inter = inters[i];
    if (!inter) return;
    var html = '';
    var nextAction = i === D.timeline.length - 1 ? 'fin()' : 'next()';
    var nextLabel = i === D.timeline.length - 1 ? '查看旅程总结 →' : '继续旅程 →';
    if (inter.type === 'choice') {
      html = '<div class="inter"><div class="q">' + inter.q + '</div>' +
        inter.opts.map(function(o, j) { return '<button class="cbtn" onclick="choose(' + i + ',' + j + ')">' + o + '</button>'; }).join('') +
        '<div class="res" id="r-' + i + '"><strong>' + inter.res + '</strong><div class="detail">' + inter.detail + '</div></div>' +
        '<button class="nxt" id="n-' + i + '" onclick="' + nextAction + '">' + nextLabel + '</button></div>';
    } else if (inter.type === 'click') {
      html = '<div class="inter click-area"><div class="q">' + inter.q + '</div>' +
        '<div class="circle" id="cc-' + i + '" onclick="tap(' + i + ')">TAP</div>' +
        '<div class="c-num" id="cn-' + i + '">0</div>' +
        '<div class="c-time" id="ct-' + i + '">5.0s</div>' +
        '<div class="res" id="r-' + i + '"><strong>' + inter.res + '</strong><div class="detail">' + inter.detail + '</div></div>' +
        '<button class="nxt" id="n-' + i + '" onclick="' + nextAction + '">' + nextLabel + '</button></div>';
    } else if (inter.type === 'slider') {
      html = '<div class="inter slider-area"><div class="q">' + inter.q + '</div>' +
        '<div class="s-num" id="sv-' + i + '">50%</div>' +
        '<input type="range" min="0" max="100" value="50" oninput="document.getElementById(\'sv-' + i + '\').textContent=this.value+\'%\'" id="sl-' + i + '">' +
        '<button class="cbtn" style="text-align:center" onclick="choose(' + i + ',-1)">确认我的选择</button>' +
        '<div class="res" id="r-' + i + '"><strong>' + inter.res + '</strong><div class="detail">' + inter.detail + '</div></div>' +
        '<button class="nxt" id="n-' + i + '" onclick="' + nextAction + '">' + nextLabel + '</button></div>';
    } else {
      html = '<div class="inter text-area"><div class="q">' + inter.q + '</div>' +
        '<textarea id="ti-' + i + '" placeholder="写下你的感悟..."></textarea>' +
        '<button class="cbtn" style="text-align:center;margin-top:10px" onclick="choose(' + i + ',-1)">提交</button>' +
        '<div class="res" id="r-' + i + '"><strong>' + inter.res + '</strong><div class="detail">' + inter.detail + '</div></div>' +
        '<button class="nxt" id="n-' + i + '" onclick="fin()">查看旅程总结 →</button></div>';
    }
    var mc = {struggle:'struggle',hope:'hope',triumph:'triumph',legacy:'legacy'}[item.mood || 'triumph'];
    var ml = {struggle:'挣扎',hope:'希望',triumph:'荣耀',legacy:'传奇'}[mc];
    var cat = imgMap[i] || '';
    var imgSrc = item.sceneImage || (imgs[cat] || [])[0] || '';
    var imgH = imgSrc ? '<img class="ch-img" src="' + imgSrc + '" alt="' + item.title + '" onerror="this.style.display=\'none\'">' : '';
    var tone = item.themeColor || {struggle:'#b85a4b',hope:'#5f8da8',triumph:'#C9A84C',legacy:'#8f7bd1'}[mc];
    var bgStyle = '--scene-image:url(' + imgSrc + ');--scene-glow:' + hexToRgba(tone, .18) + ';';
    c.innerHTML += '<div class="ch" id="c-' + i + '" style="' + bgStyle + '">' +
      '<div class="bg-yr">' + item.year.split('-')[0] + '</div>' +
      '<div class="ch-header"><div class="ch-mood m-' + mc + '">' + ml + '</div><div class="ch-title">' + item.title + '</div><div class="ch-yr">' + item.year + '</div></div>' +
      '<div class="ch-hook">' + (item.shortHook || '') + '</div>' +
      imgH +
      '<div class="ch-story">' + item.story.substring(0, 160) + '...</div>' +
      '<div class="ch-moment">' + (item.keyMoment || item.year) + '</div>' +
      '<div class="ch-quote">"' + item.quote + '"</div>' +
      html + '</div>';
  });
}

function hexToRgba(hex, alpha) {
  var clean = (hex || '#C9A84C').replace('#', '');
  var bigint = parseInt(clean.length === 3 ? clean.split('').map(function(c) { return c + c; }).join('') : clean, 16);
  var r = (bigint >> 16) & 255;
  var g = (bigint >> 8) & 255;
  var b = bigint & 255;
  return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
}

function toggleSound() {
  SoundFX.init();
  var on = SoundFX.toggle();
  document.getElementById('sound-btn').textContent = on ? '🔊' : '🔇';
}

function downloadShareCard() {
  var pct = Math.round(choices.filter(function(c) { return c.ok; }).length / Math.max(choices.length, 1) * 100);
  ShareCard.download(pct, choices, D.timeline);
}

function start() {
  SoundFX.init();
  SoundFX.play('chapter');
  document.getElementById('s-intro').classList.remove('active');
  document.getElementById('s-final').classList.remove('active');
  journeyStarted = true;
  isFinal = false;
  n = 0;
  choices = [];
  emos = [];
  resolved = D.timeline.map(function() { return false; });
  show(0);
}

function show(k, trackEmotion) {
  if (!D || !D.timeline[k]) return;
  if (trackEmotion === undefined) trackEmotion = true;
  isFinal = false;
  SoundFX.play('chapter');
  document.getElementById('s-intro').classList.remove('active');
  document.getElementById('s-final').classList.remove('active');
  document.querySelectorAll('.ch').forEach(function(c) { c.classList.remove('active'); });
  var el = document.getElementById('c-' + k);
  if (el) {
    el.scrollTop = 0;
    el.classList.add('active');
  }
  document.getElementById('pf').style.width = ((k + 1) / D.timeline.length * 100) + '%';
  document.getElementById('cn').textContent = (k + 1) + ' / ' + D.timeline.length;
  if (trackEmotion) addEmo(D.timeline[k] ? D.timeline[k].mood : null);
  showHint(resolved[k] ? 'ready' : 'idle');
}

function next() {
  goNext();
}

function goNext() {
  if (!D) return;
  if (!journeyStarted) {
    start();
    return;
  }
  if (isFinal) return;
  if (!resolved[n]) {
    showHint('locked');
    return;
  }
  if (n < D.timeline.length - 1) {
    n++;
    show(n);
  } else {
    fin();
  }
}

function goPrev() {
  if (!D || !journeyStarted) return;
  if (isFinal) {
    isFinal = false;
    document.getElementById('s-final').classList.remove('active');
    n = D.timeline.length - 1;
    show(n, false);
    return;
  }
  if (n > 0) {
    n--;
    show(n, false);
  } else {
    document.querySelectorAll('.ch').forEach(function(c) { c.classList.remove('active'); });
    document.getElementById('s-intro').classList.add('active');
    document.getElementById('pf').style.width = '0%';
    document.getElementById('cn').textContent = '';
    journeyStarted = false;
    showHint('idle');
  }
}

function bindWheel() {
  window.addEventListener('wheel', function(e) {
    if (Math.abs(e.deltaY) < 18) return;
    var scroller = getActiveScroller();
    if (scroller) {
      var atTop = scroller.scrollTop <= 2;
      var atBottom = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2;
      if (e.deltaY > 0 && !atBottom) return;
      if (e.deltaY < 0 && !atTop) return;
    }
    if (wheelLock) return;
    wheelLock = true;
    setTimeout(function() { wheelLock = false; }, 720);
    if (e.deltaY > 0) goNext();
    else goPrev();
  }, { passive: true });
}

function getActiveScroller() {
  if (isFinal) return document.getElementById('s-final');
  return document.querySelector('.ch.active');
}

function markResolved(ch) {
  resolved[ch] = true;
  showHint('ready');
  var nextButton = document.getElementById('n-' + ch);
  if (nextButton) nextButton.classList.add('show');
}

function showHint(type) {
  var hint = document.getElementById('scroll-hint');
  if (!hint) return;
  clearTimeout(hintTimer);
  hint.classList.remove('ready', 'locked', 'show');
  if (type === 'ready') {
    hint.textContent = '滚轮继续 · 或点击按钮';
    hint.classList.add('ready', 'show');
    return;
  }
  if (type === 'locked') {
    hint.textContent = '先完成这个选择';
    hint.classList.add('locked', 'show');
    hintTimer = setTimeout(function() { hint.classList.remove('show'); }, 1200);
    return;
  }
  hint.textContent = '完成选择后滚轮继续';
}

function choose(ch, idx) {
  var inter = inters[ch];
  if (!inter || resolved[ch]) return;
  var ok = idx === inter.ans || inter.ans === -1;
  var text = '';
  if (inter.type === 'text') {
    var textarea = document.getElementById('ti-' + ch);
    text = textarea ? textarea.value.trim() : '';
  }
  SoundFX.play(ok ? 'correct' : 'wrong');
  choices.push({ ch: ch, idx: idx, ok: ok, text: text });
  document.querySelectorAll('#c-' + ch + ' .cbtn').forEach(function(b, j) {
    b.disabled = true;
    if (j === idx) b.classList.add(ok ? 'ok' : 'no');
    if (inter.ans >= 0 && j === inter.ans && j !== idx) b.classList.add('ok');
  });
  document.getElementById('r-' + ch).classList.add('show');
  markResolved(ch);
}

var taps = 0, tapT = null;
function tap(ch) {
  if (resolved[ch]) return;
  if (!tapT) {
    taps = 0;
    var t0 = Date.now();
    tapT = setInterval(function() {
      var l = Math.max(0, 5 - (Date.now() - t0) / 1000);
      document.getElementById('ct-' + ch).textContent = l.toFixed(1) + 's';
      if (l <= 0) {
        clearInterval(tapT);
        tapT = null;
        var good = taps >= inters[ch].target;
        choices.push({ ch: ch, idx: taps, ok: good });
        var r = document.getElementById('r-' + ch);
        r.querySelector('strong').textContent = r.querySelector('strong').textContent.replace('{n}', taps);
        r.classList.add('show');
        markResolved(ch);
      }
    }, 50);
  }
  taps++;
  SoundFX.play('tap');
  document.getElementById('cn-' + ch).textContent = taps;
}

function addEmo(m) {
  var v = {struggle:-1, hope:0.5, triumph:1, legacy:0.8}[m] || 0;
  emos.push(v);
  var c = document.getElementById('ec');
  c.width = c.offsetWidth;
  c.height = 28;
  var ctx = c.getContext('2d');
  ctx.clearRect(0, 0, c.width, c.height);
  if (emos.length < 2) return;
  ctx.beginPath();
  emos.forEach(function(p, i) {
    var x = i * (c.width / Math.max(emos.length - 1, 1));
    var y = 14 - p * 11;
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  });
  ctx.strokeStyle = '#C9A84C';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.lineTo(c.width, 28);
  ctx.lineTo(0, 28);
  ctx.closePath();
  var g = ctx.createLinearGradient(0, 0, 0, 28);
  g.addColorStop(0, 'rgba(201,168,76,.08)');
  g.addColorStop(1, 'rgba(201,168,76,0)');
  ctx.fillStyle = g;
  ctx.fill();
}

function fin() {
  SoundFX.play('complete');
  journeyStarted = true;
  isFinal = true;
  document.querySelectorAll('.ch').forEach(function(c) { c.classList.remove('active'); });
  var pct = Math.round(choices.filter(function(c) { return c.ok; }).length / Math.max(choices.length, 1) * 100);
  document.getElementById('s-final').classList.add('active');
  document.getElementById('s-final').scrollTop = 0;
  document.getElementById('pf').style.width = '100%';
  document.getElementById('cn').textContent = '完成';
  var cur = 0;
  var el = document.getElementById('fs');
  var iv = setInterval(function() {
    cur += 2;
    if (cur >= pct) { cur = pct; clearInterval(iv); }
    el.textContent = cur + '%';
  }, 25);
  document.getElementById('ft').innerHTML =
    '<p>你经历了勒布朗从阿克伦贫民窟到NBA王座的全部旅程。</p>' +
    '<p style="margin-top:8px">你面对了他面对的每一个抉择——贫穷、分离、质疑、伤病、衰老。</p>' +
    '<p style="margin-top:12px"><em>他为什么是King？</em></p>' +
    '<p style="margin-top:6px">不是因为4个冠军，不是因为42000分。<br>而是因为<em>每一次跌倒后，他都选择了站起来</em>。</p>' +
    '<p style="margin-top:12px;font-style:italic;color:var(--gold)">"I\'m just a kid from Akron."</p>';
  document.getElementById('fc').innerHTML = choices.map(function(c) {
    var inter = inters[c.ch], tl = D.timeline[c.ch];
    var a = '';
    if (inter.type === 'choice') a = inter.opts[c.idx] || '—';
    else if (inter.type === 'click') a = '点击了' + c.idx + '次';
    else if (inter.type === 'slider') a = '信心值' + (document.getElementById('sl-' + c.ch) ? document.getElementById('sl-' + c.ch).value : 50) + '%';
    else a = c.text || '写下了感悟';
    return '<div class="fc"><div class="fc-q">' + (tl ? tl.title : '') + '</div>' + a + '</div>';
  }).join('');
  renderKnowledgeGraph();
  addEmo('legacy');
  showHint('idle');
}

function renderKnowledgeGraph() {
  var kg = document.getElementById('kg');
  if (!kg) return;
  var keywords = extractKeywords(getReflectionText());
  if (!keywords.length) {
    keywords = ['坚韧', '选择', '责任', '成长', '传奇'];
  }
  var nodes = keywords.slice(0, 8);
  var positions = [
    { x: 50, y: 18 }, { x: 78, y: 30 }, { x: 82, y: 68 }, { x: 55, y: 82 },
    { x: 25, y: 72 }, { x: 18, y: 38 }, { x: 36, y: 28 }, { x: 66, y: 52 }
  ];
  var html = '<div class="kg-title">你的关键词知识图谱</div><div class="kg-node core">LeBron Journey</div>';
  nodes.forEach(function(word, i) {
    var p = positions[i % positions.length];
    var dx = p.x - 50;
    var dy = p.y - 50;
    var width = Math.sqrt(dx * dx + dy * dy) * 6.4;
    var angle = Math.atan2(dy, dx) * 180 / Math.PI;
    html += '<span class="kg-line" style="--w:' + width.toFixed(1) + 'px;--r:' + angle.toFixed(1) + 'deg"></span>';
    html += '<span class="kg-node" style="--x:' + p.x + '%;--y:' + p.y + '%">' + escapeHTML(word) + '</span>';
  });
  kg.innerHTML = html;
  kg.classList.add('show');
}

function getReflectionText() {
  var textChoice = choices.find(function(c) {
    return inters[c.ch] && inters[c.ch].type === 'text';
  });
  return textChoice && textChoice.text ? textChoice.text : '';
}

function extractKeywords(text) {
  var source = (text || '').toLowerCase();
  var dictionary = [
    'goat', 'king', '冠军', '总冠军', '伟大', '坚韧', '坚持', '努力', '自律', '责任',
    '家庭', '母亲', '选择', '成长', '失败', '质疑', '压力', '荣耀', '传奇', '领袖',
    '回家', '承诺', '克利夫兰', '阿克伦', '湖人', '热火', '骑士', '科比', '学校',
    '公益', '影响力', '逆转', '信念', '奋斗', '不放弃', '超越', '篮球'
  ];
  var counts = {};
  dictionary.forEach(function(word) {
    var key = word.toLowerCase();
    var re = new RegExp(escapeRegExp(key), 'g');
    var matches = source.match(re);
    if (matches) counts[word] = (counts[word] || 0) + matches.length * 3;
  });
  source.split(/[^a-z0-9\u4e00-\u9fa5]+/).forEach(function(token) {
    if (!token || token.length < 2) return;
    if (['the','and','you','me','my','one','this','that','what','go','to'].includes(token)) return;
    counts[token] = (counts[token] || 0) + 1;
  });
  return Object.keys(counts).sort(function(a, b) {
    return counts[b] - counts[a] || b.length - a.length;
  }).slice(0, 8);
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapeHTML(text) {
  return String(text).replace(/[&<>"']/g, function(ch) {
    return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[ch];
  });
}
