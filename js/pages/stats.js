/* ============================================
   STATS — 数据可视化逻辑
   ============================================ */
LeBronData.load().then(function(d) {
  if (!d) return;

  var stats = d.stats;
  var scoring = d.scoring_data;
  var milestones = d.milestones;

  // ---- STATS STRIP ----
  var stripData = [
    { v: stats.championships, l: '总冠军' },
    { v: stats.mvp, l: 'MVP' },
    { v: stats.finals_mvp, l: 'FMVP' },
    { v: stats.total_points, l: '总得分' },
    { v: stats.all_star, l: '全明星' },
    { v: stats.seasons, l: '赛季' },
    { v: stats.games_played, l: '比赛场次' },
    { v: stats.olympic_gold, l: '奥运金牌' }
  ];
  document.getElementById('stats-strip').innerHTML = stripData.map(function(s) {
    return '<div class="stat-card"><div class="sv" data-target="' + s.v + '">0</div><div class="sl">' + s.l + '</div></div>';
  }).join('');

  // Animate numbers
  var stripObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.sv').forEach(function(el) {
          animateNum(el, parseInt(el.dataset.target));
        });
        stripObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  stripObs.observe(document.getElementById('stats-strip'));

  function animateNum(el, target) {
    var current = 0;
    var step = Math.max(1, Math.floor(target / 60));
    var iv = setInterval(function() {
      current += step;
      if (current >= target) { current = target; clearInterval(iv); }
      el.textContent = current.toLocaleString();
    }, 20);
  }

  // ---- PPG CHART ----
  drawChart('ppg-chart', 'ppg-tooltip', scoring, 'ppg', 'PPG', '#C9A84C');

  // ---- TOTAL POINTS CHART ----
  // Build cumulative data
  var cumData = [];
  var cumTotal = 0;
  scoring.forEach(function(s) {
    cumTotal += s.total;
    cumData.push({ year: s.year, ppg: cumTotal, total: s.total });
  });
  drawChart('total-chart', 'total-tooltip', cumData, 'ppg', '累计得分', '#C9A84C', true);

  // ---- MILESTONES ----
  document.getElementById('ms-items').innerHTML = milestones.map(function(m) {
    return '<div class="ms-item">' +
      '<div class="ms-yr">' + m.year + '</div>' +
      '<div class="ms-dot"></div>' +
      '<div class="ms-evt">' + m.event + '</div>' +
      '<div class="ms-pts">' + m.points.toLocaleString() + '分</div>' +
    '</div>';
  }).join('');

  // ---- HONORS ----
  var honors = [
    { v: stats.championships, l: 'NBA总冠军' },
    { v: stats.mvp, l: '常规赛MVP' },
    { v: stats.finals_mvp, l: '总决赛MVP' },
    { v: stats.all_star, l: '全明星入选' },
    { v: stats.all_nba_first, l: '最佳一阵' },
    { v: stats.all_defensive_first, l: '最佳防守一阵' },
    { v: stats.olympic_gold, l: '奥运金牌' },
    { v: stats.scoring_title, l: '得分王' }
  ];
  document.getElementById('honors-grid').innerHTML = honors.map(function(h) {
    return '<div class="honor-card"><div class="hv" data-target="' + h.v + '">0</div><div class="hl">' + h.l + '</div></div>';
  }).join('');

  var honorObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.hv').forEach(function(el) {
          animateNum(el, parseInt(el.dataset.target));
        });
        honorObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  honorObs.observe(document.getElementById('honors-grid'));

  // ---- CHART DRAWING ----
  function drawChart(canvasId, tooltipId, data, key, label, color, isArea) {
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var tooltip = document.getElementById(tooltipId);
    var wrap = canvas.parentElement;

    function render() {
      var dpr = window.devicePixelRatio || 1;
      var w = wrap.clientWidth - 40;
      var h = 280;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      var padL = 50, padR = 20, padT = 20, padB = 40;
      var chartW = w - padL - padR;
      var chartH = h - padT - padB;

      var vals = data.map(function(d) { return d[key]; });
      var minV = Math.min.apply(null, vals) * 0.9;
      var maxV = Math.max.apply(null, vals) * 1.05;
      var range = maxV - minV || 1;

      // Grid lines
      ctx.strokeStyle = 'rgba(255,255,255,.04)';
      ctx.lineWidth = 1;
      for (var g = 0; g <= 4; g++) {
        var gy = padT + chartH * (1 - g / 4);
        ctx.beginPath(); ctx.moveTo(padL, gy); ctx.lineTo(padL + chartW, gy); ctx.stroke();
        // Y label
        var gVal = minV + range * g / 4;
        ctx.fillStyle = '#444';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.textAlign = 'right';
        ctx.fillText(isArea ? Math.round(gVal).toLocaleString() : gVal.toFixed(1), padL - 8, gy + 4);
      }

      // X labels
      ctx.textAlign = 'center';
      data.forEach(function(d, i) {
        if (i % 2 === 0 || data.length <= 10) {
          var x = padL + (i / (data.length - 1)) * chartW;
          ctx.fillStyle = '#444';
          ctx.fillText(d.year, x, h - 8);
        }
      });

      // Draw line/area
      ctx.beginPath();
      data.forEach(function(d, i) {
        var x = padL + (i / (data.length - 1)) * chartW;
        var y = padT + chartH * (1 - (d[key] - minV) / range);
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      });
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();

      if (isArea) {
        var lastX = padL + chartW;
        var firstX = padL;
        ctx.lineTo(lastX, padT + chartH);
        ctx.lineTo(firstX, padT + chartH);
        ctx.closePath();
        var grad = ctx.createLinearGradient(0, padT, 0, padT + chartH);
        grad.addColorStop(0, 'rgba(201,168,76,.15)');
        grad.addColorStop(1, 'rgba(201,168,76,0)');
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Draw dots
      data.forEach(function(d, i) {
        var x = padL + (i / (data.length - 1)) * chartW;
        var y = padT + chartH * (1 - (d[key] - minV) / range);
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      });

      // Store for tooltip
      canvas._chartData = data;
      canvas._chartKey = key;
      canvas._chartMin = minV;
      canvas._chartRange = range;
      canvas._chartPadL = padL;
      canvas._chartPadT = padT;
      canvas._chartW = chartW;
      canvas._chartH = chartH;
      canvas._chartLabel = label;
      canvas._chartIsArea = isArea;
    }

    render();
    window.addEventListener('resize', render);

    // Tooltip
    canvas.addEventListener('mousemove', function(e) {
      var rect = canvas.getBoundingClientRect();
      var mx = e.clientX - rect.left;
      var data = canvas._chartData;
      if (!data || data.length < 2) return;

      var idx = Math.round((mx - canvas._chartPadL) / canvas._chartW * (data.length - 1));
      idx = Math.max(0, Math.min(data.length - 1, idx));
      var d = data[idx];
      var x = canvas._chartPadL + (idx / (data.length - 1)) * canvas._chartW;

      tooltip.style.display = 'block';
      tooltip.style.left = (x + 20) + 'px';
      tooltip.style.top = '40px';
      var val = d[canvas._chartKey];
      tooltip.innerHTML = '<div class="tt-year">' + d.year + (d.year < 2026 ? ' 赛季' : '') + '</div>' +
        '<div class="tt-val">' + canvas._chartLabel + ': ' + (canvas._chartIsArea ? Math.round(val).toLocaleString() : val.toFixed(1)) + '</div>';
    });

    canvas.addEventListener('mouseleave', function() {
      tooltip.style.display = 'none';
    });
  }
});
