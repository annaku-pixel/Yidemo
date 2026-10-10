import { Icons } from "./Icons.js";
import { esc } from "./html.js";

  var PaymentList = class {
    /**
     * @param {import('../models/PaymentMethod.js').PaymentMethod[]} methods
     * @param {string} selectedId
     */
    static render(methods, selectedId) {
      const rows = methods.map((m) => `
      <label class="opt"><input type="radio" name="pay" value="${m.id}" ${m.id === selectedId ? "checked" : ""} data-act="set-payment">
        <div><b>${esc(m.title)}</b><span>${m.note}</span></div><span>${m.isCashless ? Icons.card : ""}</span></label>`).join("");
      return `<div class="list" role="radiogroup">${rows}</div>
      <button class="secondary" data-act="toast" data-msg="\u0414\u043E\u0434\u0430\u0432\u0430\u043D\u043D\u044F \u043A\u0430\u0440\u0442\u043A\u0438 \u0443 \u043F\u0440\u043E\u0442\u043E\u0442\u0438\u043F\u0456 \u0456\u043C\u0456\u0442\u0443\u0454\u0442\u044C\u0441\u044F">+ \u0414\u043E\u0434\u0430\u0442\u0438 \u043A\u0430\u0440\u0442\u043A\u0443</button>`;
    }
  };

export { PaymentList };
