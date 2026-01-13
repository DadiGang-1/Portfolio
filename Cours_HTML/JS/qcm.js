(function(window, document){
  const { createElem } = window.UI || {};
  // create QCM in a container.
  // onCorrect callback invoked when user picks the correct choice.
  // onAnswered callback invoked on any answer (correct or incorrect).
  function createQCM(questionText, optionsArray, correctAnswer, onCorrect, onAnswered){
    const q = createElem ? createElem('div', { class: 'question' }) : document.createElement('div');
    q.classList.add('question');
    const pre = createElem('pre', {}); pre.textContent = questionText;
    const opts = createElem('div', { class: 'options' });
    const status = createElem('p', { class: 'status', 'aria-live':'polite' });
    let answered = false;

    optionsArray.forEach(opt => {
      const btn = createElem('button', { type: 'button' }, opt);
      btn.addEventListener('click', ()=>{
        if (answered) return;
        // on any click, lock the answer and mark answered
        answered = true;
        q.dataset.answered = 'true';
        disableAll();
        if (opt === correctAnswer){
          q.classList.remove('wrong'); q.classList.add('correct');
          q.style.borderColor = '#2ecc71'; q.style.boxShadow = '0 0 12px 6px rgba(46,204,113,0.20)';
          status.textContent = 'Correct ✅';
          if (typeof onCorrect === 'function') onCorrect(q);
        } else {
          q.classList.remove('correct'); q.classList.add('wrong');
          q.style.borderColor = '#e74c3c'; q.style.boxShadow = '0 0 12px 6px rgba(231,76,60,0.20)';
          status.textContent = 'Incorrect ❌';
        }
        // notify that this question has been answered (used to compute final score)
        if (typeof onAnswered === 'function') onAnswered(q);
      });
      opts.appendChild(btn);
    });

    function disableAll(){ opts.querySelectorAll('button').forEach(b=> b.disabled=true); }

    // expose a reset method so core can fully reset internal state
    q.reset = function(){
      answered = false; // reset internal flag
      // ensure data-answered flag is removed
      if (q.dataset.answered) delete q.dataset.answered;
      q.classList.remove('correct','wrong');
      q.style.borderColor = '';
      q.style.boxShadow = '';
      const stat = q.querySelector('.status'); if (stat) stat.textContent = '';
      q.querySelectorAll('.options button').forEach(b=>{ b.disabled = false; });
    };

    q.appendChild(pre); q.appendChild(opts); q.appendChild(status);
    return q;
  }
  window.QCM = { create: createQCM };
})(window, document);