(function(window, document){
  const { createElem } = window.UI || {};
  let fwCanvas, fwCtx, W, H, particles=[], fwAnim;
  function setupFW(){
    if (!fwCanvas){
      if (createElem) fwCanvas = createElem('canvas', { class: 'fireworks-canvas', 'aria-hidden':'true' });
      else fwCanvas = document.createElement('canvas');
      document.body.appendChild(fwCanvas);
    }
    fwCanvas.width = window.innerWidth; fwCanvas.height = window.innerHeight;
    fwCtx = fwCanvas.getContext('2d'); W = fwCanvas.width; H = fwCanvas.height;
  }
  function rand(min,max){ return Math.random()*(max-min)+min; }
  function launchFireworks(){
    setupFW(); fwCanvas.style.display='block'; fwCanvas.setAttribute('aria-hidden','false');
    for (let i=0;i<120;i++) particles.push({ x: W/2, y: H/2, vx: rand(-8,8), vy: rand(-12,-2), color:`hsl(${Math.floor(rand(0,360))},80%,50%)`, life: rand(60,120) });
    (function loop(){
      fwCtx.clearRect(0,0,W,H);
      for (let p of particles){ p.x+=p.vx; p.y+=p.vy; p.vy+=0.25; p.life-=1; fwCtx.fillStyle=p.color; fwCtx.fillRect(p.x,p.y,4,8); }
      particles = particles.filter(p=>p.life>0);
      if (particles.length>0) fwAnim = requestAnimationFrame(loop); else stopFireworks();
    })();
    setTimeout(stopFireworks,4000);
  }
  function stopFireworks(){ if (fwAnim) cancelAnimationFrame(fwAnim); particles=[]; if (fwCtx) fwCtx.clearRect(0,0,W,H); if(fwCanvas) { fwCanvas.style.display='none'; fwCanvas.setAttribute('aria-hidden','true'); }}
  window.Effects = { launch: launchFireworks, stop: stopFireworks };
  window.addEventListener('resize', ()=>{ if (fwCanvas && fwCanvas.style.display!=='none') setupFW(); });
})(window, document);