(function(window, document){
  const { createElem } = window.UI || {};
  const Q = window.QCM || {}; const Effects = window.Effects || {}; const Hints = window.Hints || {};

  function ensureControls(container){
    let ctrl = container.querySelector('.controls');
    if (!ctrl){
      ctrl = createElem('div', { class: 'controls' });
      const reset = createElem('button', { type:'button', id:'exercise-reset' }, 'Réinitialiser');
      reset.addEventListener('click', ()=>{
        container.querySelectorAll('.question').forEach(qq=>{
          // prefer calling per-question reset if available (resets internal flags)
          if (typeof qq.reset === 'function') qq.reset();
          else {
            qq.classList.remove('correct','wrong');
            qq.querySelectorAll('button').forEach(b=> b.disabled=false);
            const st = qq.querySelector('.status'); if (st) st.textContent='';
            qq.style.borderColor=''; qq.style.boxShadow='';
            // clear answered flag when generic reset is used
            if (qq.dataset.answered) delete qq.dataset.answered;
          }
        });
        // clear inline score when manual reset
        const scoreEl = container.querySelector('.exercise-score'); if (scoreEl) scoreEl.textContent = '';
        // reset Results internal state if available
        if (window.Results && typeof window.Results.reset === 'function') window.Results.reset();
        if (Effects && Effects.stop) Effects.stop();
      });
      const hint = createElem('button', { type:'button', id:'exercise-hint' }, 'Indice');
      hint.addEventListener('click', ()=>{ if (Hints && Hints.open) Hints.open(); });
      ctrl.appendChild(reset); ctrl.appendChild(hint);
      container.appendChild(ctrl);
    } else { container.appendChild(ctrl); }
    return ctrl;
  }

  function addExercise(questionText, optionsArray, correctAnswer){
    const container = document.querySelector('.exercise');
    if (!container) return console.warn('Aucun conteneur .exercise trouvé.');

    // create question using QCM
    // pass onAnswered so that checkAllCorrect runs when any question is answered
    const qEl = Q.create(questionText, optionsArray, correctAnswer, undefined, ()=>{ checkAllCorrect(container); });
    container.insertBefore(qEl, container.querySelector('.controls'));
    ensureControls(container);
  }

  function checkAllCorrect(container){
    const all = Array.from(container.querySelectorAll('.question'));
    if (all.length === 0) return;
    // check if all answered
    const allAnswered = all.every(q => q.dataset.answered === 'true');
    if (!allAnswered) return;
    const score = all.reduce((s,q)=> s + (q.classList.contains('correct')?1:0), 0);
    const total = all.length;
    const allCorrect = score === total;

    // update inline score display
    let scoreEl = container.querySelector('.exercise-score');
    if (!scoreEl){ scoreEl = createElem ? createElem('div', { class: 'exercise-score' }) : document.createElement('div'); scoreEl.classList.add('exercise-score');
      const ctrl = container.querySelector('.controls');
      if (ctrl) container.insertBefore(scoreEl, ctrl);
      else container.appendChild(scoreEl);
    }
    scoreEl.textContent = `Score : ${score} / ${total}`;

    // show results modal
    // avoid re-showing if modal is already visible
    if (window.Results && window.Results.isShown && window.Results.isShown()) return;
    if (window.Results && window.Results.show){
      window.Results.show(score, total, allCorrect, {
        onContinue: ()=>{ /* close modal only */ },
        onReset: ()=>{ // reset all questions in this container
          container.querySelectorAll('.question').forEach(qq=>{ if (typeof qq.reset === 'function') qq.reset(); else { qq.classList.remove('correct','wrong'); qq.querySelectorAll('button').forEach(b=> b.disabled=false); const st = qq.querySelector('.status'); if(st) st.textContent=''; qq.style.borderColor=''; qq.style.boxShadow=''; if (qq.dataset.answered) delete qq.dataset.answered; } });
          // clear inline score
          const scoreEl = container.querySelector('.exercise-score'); if (scoreEl) scoreEl.textContent = '';
          // ensure Results internal state cleared
          if (window.Results && typeof window.Results.reset === 'function') window.Results.reset();
        }
      });
    }
  }

  window.Core = { addExercise, checkAllCorrect };
  window.addExercise = addExercise; // backward compat
  window.setExerciseHints = (hints) => { if (Hints && Hints.set) Hints.set(hints); };
})(window, document);