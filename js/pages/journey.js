/* ============================================
   JOURNEY — 互动旅程逻辑
   ============================================ */
var D, n = 0, choices = [], emos = [];

var inters = [
  {type:'choice',
   q:'面对贫困和无家可归的童年，\n你会怎么选择？',
   opts:['放弃，接受命运','把痛苦变成动力，拼命训练'],
   ans:1,
   res:'勒布朗选择了后者。',
   detail:'篮球成了他逃离现实的唯一出口。每天放学后，他在破旧的球场上练习到天黑。汗水冲刷掉生活的苦涩，也锻造了他钢铁般的意志。这是他人生中第一个重要的选择——不向命运低头。'},
  {type:'choice',
   q:'Walker家庭给了你一个家，\n但你必须和母亲分开。你接受吗？',
   opts:['不接受，我要和妈妈在一起','接受，为了更好的未来'],
   ans:1,
   res:'勒布朗接受了。',
   detail:'这个决定让他第一次拥有了稳定的房间、规律的作息、按时上学的机会。后来他给母亲买了一栋房子，用行动证明：暂时的分离是为了更好的重逢。'},
  {type:'click',
   q:'在5秒内尽可能快地点击！\n模拟勒布朗高中每天训练8小时的拼劲',
   target:25,
   res:'你点击了{n}次！',
   detail:'勒布朗在高中时每天训练8小时以上。2001年，16岁的他登上Sports Illustrated封面，标题写着"天选之子"。但没人知道，这个少年每天凌晨5点就起床训练。天赋只是起点，努力才是通往伟大的阶梯。'},
  {type:'choice',
   q:'2010年，你的合同到期了。\n留在克利夫兰可能永远拿不到冠军，\n去迈阿密会被全美骂叛徒。你怎么选？',
   opts:['留队，忠诚比冠军重要','离队，为了总冠军拼一把'],
   ans:-1,
   res:'勒布朗选择了离开。',
   detail:'他在全国电视直播中宣布加盟热火，被全国唾骂，球迷烧了他的球衣。但他说："我做了对自己最好的决定。"有时候，做正确的事比做受欢迎的事更需要勇气。这个决定让他背负了巨大的骂名，但也让他学会了如何在逆境中成长。'},
  {type:'choice',
   q:'2011年总决赛你表现失常，\n球队被逆转。批评声铺天盖地。你会？',
   opts:['被压力击垮，怀疑自己','把批评当燃料，更拼命训练'],
   ans:1,
   res:'勒布朗选择了面对。',
   detail:'他在休赛期疯狂训练，开发了背身单打，每天投1000个跳投。2012年，他用总冠军和FMVP回应了所有质疑。失败不是终点，而是转折点。真正的冠军，是在最低谷时还能站起来的人。'},
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
});

function build() {
  var c = document.getElementById('chs');
  var imgMap = ['childhood','high_school','cleveland_first','the_decision','cleveland_return','lakers','scoring_record'];
  var imgs = D.images || {};
  D.timeline.forEach(function(item, i) {
    var inter = inters[i];
    var html = '';
    if (inter.type === 'choice') {
      html = '<div class="inter"><div class="q">' + inter.q + '</div>' +
        inter.opts.map(function(o, j) { return '<button class="cbtn" onclick="choose(' + i + ',' + j + ')">' + o + '</button>'; }).join('') +
        '<div class="res" id="r-' + i + '"><strong>' + inter.res + '</strong><div class="detail">' + inter.detail + '</div></div>' +
        '<button class="nxt" id="n-' + i + '" onclick="next()">继续旅程 →</button></div>';
    } else if (inter.type === 'click') {
      html = '<div class="inter click-area"><div class="q">' + inter.q + '</div>' +
        '<div class="circle" id="cc-' + i + '" onclick="tap(' + i + ')">TAP</div>' +
        '<div class="c-num" id="cn-' + i + '">0</div>' +
        '<div class="c-time" id="ct-' + i + '">5.0s</div>' +
        '<div class="res" id="r-' + i + '"><strong>' + inter.res + '</strong><div class="detail">' + inter.detail + '</div></div>' +
        '<button class="nxt" id="n-' + i + '" onclick="next()">继续旅程 →</button></div>';
    } else if (inter.type === 'slider') {
      html = '<div class="inter slider-area"><div class="q">' + inter.q + '</div>' +
        '<div class="s-num" id="sv-' + i + '">50%</div>' +
        '<input type="range" min="0" max="100" value="50" oninput="document.getElementById(\'sv-' + i + '\').textContent=this.value+\'%\'" id="sl-' + i + '">' +
        '<button class="cbtn" style="text-align:center" onclick="choose(' + i + ',-1)">确认我的选择</button>' +
        '<div class="res" id="r-' + i + '"><strong>' + inter.res + '</strong><div class="detail">' + inter.detail + '</div></div>' +
        '<button class="nxt" id="n-' + i + '" onclick="next()">继续旅程 →</button></div>';
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
    var imgSrc = (imgs[cat] || [])[0] || '';
    var imgH = imgSrc ? '<img class="ch-img" src="' + imgSrc + '" alt="' + item.title + '" onerror="this.style.display=\'none\'">' : '';
    var bg = {struggle:'rgba(192,57,43,.03)',hope:'rgba(41,128,185,.03)',triumph:'rgba(201,168,76,.03)',legacy:'rgba(142,68,173,.03)'}[mc];
    c.innerHTML += '<div class="ch" id="c-' + i + '" style="background:radial-gradient(ellipse at 50% 50%,' + bg + ' 0%,transparent 60%)">' +
      '<div class="bg-yr">' + item.year.split('-')[0] + '</div>' +
      '<div class="ch-header"><div class="ch-mood m-' + mc + '">' + ml + '</div><div class="ch-title">' + item.title + '</div><div class="ch-yr">' + item.year + '</div></div>' +
      imgH +
      '<div class="ch-story">' + item.story.substring(0, 160) + '...</div>' +
      '<div class="ch-quote">"' + item.quote + '"</div>' +
      html + '</div>';
  });
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
  n = 0;
  show(0);
}

function show(k) {
  SoundFX.play('chapter');
  document.querySelectorAll('.ch').forEach(function(c) { c.classList.remove('active'); });
  var el = document.getElementById('c-' + k);
  if (el) el.classList.add('active');
  document.getElementById('pf').style.width = (k / D.timeline.length * 100) + '%';
  document.getElementById('cn').textContent = (k + 1) + ' / ' + D.timeline.length;
  addEmo(D.timeline[k] ? D.timeline[k].mood : null);
}

function next() {
  n++;
  if (n < D.timeline.length) show(n);
}

function choose(ch, idx) {
  var inter = inters[ch];
  var ok = idx === inter.ans || inter.ans === -1;
  SoundFX.play(ok ? 'correct' : 'wrong');
  choices.push({ ch: ch, idx: idx, ok: ok });
  document.querySelectorAll('#c-' + ch + ' .cbtn').forEach(function(b, j) {
    b.disabled = true;
    if (j === idx) b.classList.add(ok ? 'ok' : 'no');
    if (inter.ans >= 0 && j === inter.ans && j !== idx) b.classList.add('ok');
  });
  document.getElementById('r-' + ch).classList.add('show');
  document.getElementById('n-' + ch).classList.add('show');
}

var taps = 0, tapT = null;
function tap(ch) {
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
        document.getElementById('n-' + ch).classList.add('show');
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
  document.querySelectorAll('.ch').forEach(function(c) { c.classList.remove('active'); });
  var pct = Math.round(choices.filter(function(c) { return c.ok; }).length / Math.max(choices.length, 1) * 100);
  document.getElementById('s-final').classList.add('active');
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
    else a = '写下了感悟';
    return '<div class="fc"><div class="fc-q">' + (tl ? tl.title : '') + '</div>' + a + '</div>';
  }).join('');
  addEmo('legacy');
}
