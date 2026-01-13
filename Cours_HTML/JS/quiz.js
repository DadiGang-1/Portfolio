// quiz.js - loader / bootstrapper
(function(document){
  const base = document.currentScript && document.currentScript.src ? document.currentScript.src.replace(/\/[^/]*$/, '') : '.';
  // modules loading order - results.js must be before core.js
  const files = ['ui.js','effects.js','hints.js','qcm.js','results.js','core.js'];
  function loadSequential(idx){
    if (idx >= files.length) return; // done
    const s = document.createElement('script');
    s.src = base + '/' + files[idx];
    s.onload = ()=> loadSequential(idx+1);
    s.onerror = ()=> console.error('Failed to load', s.src);
    document.head.appendChild(s);
  }
  loadSequential(0);
})(document);
