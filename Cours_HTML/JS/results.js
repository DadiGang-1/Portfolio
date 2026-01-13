(function(window, document){
  const { createElem } = window.UI || {};
  let modal;
  function ensureModal(){
    if (modal) return;
    modal = createElem ? createElem('div', { class: 'exercise-result-modal', 'aria-hidden':'true', role:'dialog' }) : document.createElement('div');
    modal.classList.add('exercise-result-modal');
    const content = createElem ? createElem('div', { class: 'modal-content' }) : document.createElement('div');
    content.classList.add('modal-content');
    const title = createElem('h3', {}, 'Résultat');
    const body = createElem('div', { class: 'result-body' });
    const actions = createElem('div', { class: 'result-actions' });
    const contBtn = createElem('button', { type:'button', class:'result-continue' }, 'Continuer');
    const resetBtn = createElem('button', { type:'button', class:'result-reset' }, 'Réinitialiser');
    actions.appendChild(contBtn); actions.appendChild(resetBtn);
    content.appendChild(title); content.appendChild(body); content.appendChild(actions);
    modal.appendChild(content);
    document.body.appendChild(modal);

    contBtn.addEventListener('click', ()=>{ hide(); if (typeof modal.onContinue==='function') modal.onContinue(); });
    resetBtn.addEventListener('click', ()=>{ hide(); if (typeof modal.onReset==='function') modal.onReset(); });
  }

  function show(score, total, allCorrect, opts={}){
    ensureModal();
    const body = modal.querySelector('.result-body');
    body.innerHTML = '';
    const p = createElem ? createElem('p', {}, `Tu as obtenu ${score} / ${total}`) : document.createElement('p'); if(!createElem) p.textContent = `Tu as obtenu ${score} / ${total}`;
    body.appendChild(p);
    if (allCorrect){
      const msg = createElem ? createElem('p', {}, 'Parfait ! Tout est correct 🎉') : document.createElement('p'); if(!createElem) msg.textContent='Parfait ! Tout est correct 🎉';
      body.appendChild(msg);
    }
    modal.onContinue = opts.onContinue;
    modal.onReset = opts.onReset;
    modal.setAttribute('aria-hidden','false');
    modal._shown = true;
    // launch fireworks if all correct
    if (allCorrect && window.Effects && window.Effects.launch) window.Effects.launch();
  }
  function hide(){ if(modal) modal.setAttribute('aria-hidden','true'); }
  function reset(){
    if (!modal) return;
    modal.onContinue = null; modal.onReset = null;
    hide(); modal._shown = false;
    if (window.Effects && window.Effects.stop) window.Effects.stop();
  }
  function isShown(){ return !!(modal && modal._shown); }

  window.Results = { show, hide, reset, isShown };
})(window, document);