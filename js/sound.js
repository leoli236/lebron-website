/* ============================================
   SOUND — Web Audio API 音效系统
   ============================================ */
window.SoundFX = (function() {
  var ctx = null;
  var enabled = true;

  function init() {
    if (ctx) return;
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch(e) { /* 不支持 */ }
  }

  function play(type) {
    if (!ctx || !enabled) return;
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    var now = ctx.currentTime;
    gain.gain.setValueAtTime(0.08, now);

    switch(type) {
      case 'click':
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(now); osc.stop(now + 0.1);
        break;
      case 'correct':
        osc.frequency.setValueAtTime(523, now);
        osc.frequency.setValueAtTime(659, now + 0.1);
        osc.frequency.setValueAtTime(784, now + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now); osc.stop(now + 0.35);
        break;
      case 'wrong':
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.type = 'sawtooth';
        osc.start(now); osc.stop(now + 0.25);
        break;
      case 'chapter':
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(660, now + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now); osc.stop(now + 0.4);
        break;
      case 'complete':
        osc.frequency.setValueAtTime(523, now);
        osc.frequency.setValueAtTime(659, now + 0.15);
        osc.frequency.setValueAtTime(784, now + 0.3);
        osc.frequency.setValueAtTime(1047, now + 0.45);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
        osc.start(now); osc.stop(now + 0.7);
        break;
      case 'tap':
        osc.frequency.setValueAtTime(600, now);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now); osc.stop(now + 0.05);
        break;
    }
  }

  function toggle() {
    enabled = !enabled;
    return enabled;
  }

  return { init: init, play: play, toggle: toggle, isEnabled: function() { return enabled; } };
})();
