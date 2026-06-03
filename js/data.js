/* ============================================
   DATA — 统一数据加载 + 缓存
   ============================================ */
window.LeBronData = (function() {
  let cache = null;

  function load() {
    if (cache) return Promise.resolve(cache);
    return fetch('data/lebron_data.json')
      .then(function(r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function(d) {
        cache = d;
        return d;
      })
      .catch(function(e) {
        console.error('数据加载失败:', e);
        var main = document.querySelector('main') || document.body;
        var err = document.createElement('div');
        err.style.cssText = 'text-align:center;padding:100px 20px;color:#666;';
        err.innerHTML = '<p style="font-size:48px;margin-bottom:16px">⚠️</p><p>数据加载失败，请刷新页面重试</p>';
        main.prepend(err);
        return null;
      });
  }

  return { load: load };
})();
