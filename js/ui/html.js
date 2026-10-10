

  function esc(value) {
    return String(value).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  }
  function uah(amount) {
    return `${Math.round(amount)} \u20B4`;
  }
  function plate(number) {
    return `<span class="plate" aria-label="\u041D\u043E\u043C\u0435\u0440 \u0430\u0432\u0442\u043E ${esc(number)}"><span class="ua">UA</span><span class="num">${esc(number)}</span></span>`;
  }

export { esc, uah, plate };
