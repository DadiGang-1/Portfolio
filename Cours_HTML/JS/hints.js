(function(window, document){
  const { createElem } = window.UI || {};
  let hintModal, hintList, hintClose;
  function ensureHintModal(){
    if (hintModal) return;
    hintModal = createElem ? createElem('div', { class: 'exercise-hint-modal', 'aria-hidden':'true', role:'dialog' }) : document.createElement('div');
    hintModal.classList.add('exercise-hint-modal');
    const content = createElem ? createElem('div', { class: 'modal-content' }) : document.createElement('div');
    content.classList.add('modal-content');
    content.appendChild(createElem('h4', {}, 'Indice'));
    hintList = createElem('ul');
    content.appendChild(hintList);
    hintClose = createElem('button', { type:'button' }, 'Fermer');
    hintClose.addEventListener('click', ()=>{ closeHints(); });
    content.appendChild(hintClose);
    hintModal.appendChild(content);
    document.body.appendChild(hintModal);
  }
  function setExerciseHints(hints){
    ensureHintModal();
    hintList.innerHTML = '';
    if (!hints || hints.length===0){
      const li = createElem('li', {}, 'Aucun indice disponible.');
      hintList.appendChild(li); return;
    }
    hints.forEach(h=>{
      const li = createElem('li');
      const a = createElem('a', { href: h.href }, h.text);
      li.appendChild(a);
      hintList.appendChild(li);
    });
  }
  function openHints(){ ensureHintModal(); hintModal.setAttribute('aria-hidden','false'); }
  function closeHints(){ if(hintModal) hintModal.setAttribute('aria-hidden','true'); }

  window.Hints = { set: setExerciseHints, open: openHints, close: closeHints };
})(window, document);