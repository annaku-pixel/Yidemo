import { Modal } from "./Modal.js";
import { esc } from "../html.js";

  var OptionsModal = class extends Modal {
    static id = "options";
    get title() {
      return "\u041F\u043E\u0431\u0430\u0436\u0430\u043D\u043D\u044F \u0434\u043E \u043F\u043E\u0457\u0437\u0434\u043A\u0438";
    }
    body() {
      const order = this.app.order;
      const rows = this.app.catalog.options.map((o) => {
        const on = order.hasOption(o.id);
        const variants = on && o.variants ? `<div class="subopts">${Object.entries(o.variants).map(([k, v]) => `<button class="chip" data-act="option-variant" data-option="${o.id}" data-id="${k}" aria-pressed="${order.optionVariant(o.id) === k}">${v}</button>`).join("")}</div>` : "";
        return `<label class="opt"><input type="checkbox" id="o_${o.id}" data-act="toggle-option" data-id="${o.id}" ${on ? "checked" : ""}>
        <div><b>${o.name}</b><span>${o.description}</span></div><em>${o.priceLabel}</em></label>${variants}`;
      }).join("");
      return `<div>${rows}</div>
      <div><h3 class="mb8">\u041A\u043E\u043C\u0435\u043D\u0442\u0430\u0440 \u0432\u043E\u0434\u0456\u044E</h3><textarea id="comment" placeholder="\u041D\u0430\u043F\u0440.: \u043F\u0456\u0434\u2019\u0457\u0437\u0434 \u21162, \u0447\u0435\u043A\u0430\u0454\u043C\u043E \u0431\u0456\u043B\u044F \u0448\u043B\u0430\u0433\u0431\u0430\u0443\u043C\u0430">${esc(order.comment)}</textarea></div>
      <button class="primary" data-act="save-options">\u0417\u0431\u0435\u0440\u0435\u0433\u0442\u0438</button>`;
    }
    /** Зберегти введений коментар перед перемальовуванням. */
    #keepComment() {
      const c = document.getElementById("comment");
      if (c) this.app.order.comment = c.value;
    }
    handle(action, el) {
      const order = this.app.order;
      switch (action) {
        case "toggle-option":
          this.#keepComment();
          order.setOption(this.app.catalog.option(el.dataset.id), el.checked);
          this.app.render();
          return true;
        case "option-variant":
          this.#keepComment();
          order.setOptionVariant(el.dataset.option, el.dataset.id);
          this.app.render();
          return true;
        case "save-options": {
          this.#keepComment();
          this.app.scenario.complete(1);
          this.app.closeModal();
          const child = this.app.catalog.option("child");
          this.app.toast(order.hasOption("child") ? `\u0414\u043E\u0434\u0430\u043D\u043E \u0434\u0438\u0442\u044F\u0447\u0435 \u043A\u0440\u0456\u0441\u043B\u043E: ${child.variantLabel(order.optionVariant("child"))}` : "\u041F\u043E\u0431\u0430\u0436\u0430\u043D\u043D\u044F \u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u043E");
          return true;
        }
        default:
          return false;
      }
    }
  };

export { OptionsModal };
