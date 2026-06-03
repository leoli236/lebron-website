/* ============================================
   SHARE CARD — 生成旅程分享卡片
   ============================================ */
window.ShareCard = (function() {

  function generate(pct, choices, timeline) {
    var canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 900;
    var ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#06080c';
    ctx.fillRect(0, 0, 600, 900);

    // Gold border
    ctx.strokeStyle = '#C9A84C';
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, 560, 860);

    // Inner border
    ctx.strokeStyle = 'rgba(201,168,76,.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(30, 30, 540, 840);

    // Title
    ctx.fillStyle = '#C9A84C';
    ctx.font = '900 36px "Playfair Display", serif';
    ctx.textAlign = 'center';
    ctx.fillText('最长的河', 300, 90);

    ctx.font = '12px Inter, sans-serif';
    ctx.fillStyle = '#666';
    ctx.letterSpacing = '4px';
    ctx.fillText('THE LONGEST RIVER · MY JOURNEY', 300, 120);

    // Score
    ctx.font = '900 120px "Playfair Display", serif';
    ctx.fillStyle = '#C9A84C';
    ctx.fillText(pct + '%', 300, 260);

    ctx.font = '14px Inter, sans-serif';
    ctx.fillStyle = '#666';
    ctx.fillText('与勒布朗的共鸣指数', 300, 290);

    // Divider
    ctx.strokeStyle = 'rgba(201,168,76,.15)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(80, 320); ctx.lineTo(520, 320); ctx.stroke();

    // Choices summary
    ctx.textAlign = 'left';
    ctx.font = '11px Inter, sans-serif';
    var y = 360;
    choices.forEach(function(c, i) {
      if (i >= 7) return;
      var tl = timeline[c.ch];
      if (!tl) return;

      // Mood dot
      var moodColor = {struggle:'#c0392b',hope:'#2980b9',triumph:'#C9A84C',legacy:'#8e44ad'}[tl.mood || 'triumph'];
      ctx.fillStyle = moodColor;
      ctx.beginPath(); ctx.arc(90, y + 4, 4, 0, Math.PI * 2); ctx.fill();

      // Title
      ctx.fillStyle = '#888';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText(tl.title, 105, y + 8);

      // Result
      ctx.fillStyle = c.ok ? '#27ae60' : '#c0392b';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(c.ok ? '✓ 做出了同样的选择' : '✗ 走了不同的路', 510, y + 8);
      ctx.textAlign = 'left';

      y += 30;
    });

    // Quote
    ctx.textAlign = 'center';
    ctx.font = 'italic 13px Inter, sans-serif';
    ctx.fillStyle = 'rgba(201,168,76,.5)';
    ctx.fillText('"I\'m just a kid from Akron."', 300, 760);

    // Footer
    ctx.font = '10px Inter, sans-serif';
    ctx.fillStyle = '#333';
    ctx.fillText('KING JAMES · FAN SITE · 2026', 300, 830);

    // Watermark
    ctx.font = '9px Inter, sans-serif';
    ctx.fillStyle = '#222';
    ctx.fillText('lebron-website', 300, 860);

    return canvas.toDataURL('image/png');
  }

  function download(pct, choices, timeline) {
    var dataUrl = generate(pct, choices, timeline);
    var a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'my-lebron-journey.png';
    a.click();
  }

  return { generate: generate, download: download };
})();
