// UI helpers
(function(window, document){
  function createElem(tag, props={}, ...children){
    const el = document.createElement(tag);
    Object.entries(props).forEach(([k,v])=> el.setAttribute(k,v));
    children.forEach(c=>{ if (typeof c === 'string') el.appendChild(document.createTextNode(c)); else if (c) el.appendChild(c); });
    return el;
  }
  window.UI = { createElem };
})(window, document);