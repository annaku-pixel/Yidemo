import { Icons } from "./Icons.js";
import { esc } from "./html.js";

  var CallOverlay = class {
    constructor() {
      this.driver = null;
    }
    get isOpen() {
      return Boolean(this.driver);
    }
    open(driver) {
      this.driver = driver;
    }
    close() {
      this.driver = null;
    }
    render() {
      if (!this.driver) return "";
      const d = this.driver;
      return `<div class="callscr"><span class="avatar">${d.initials}</span><b class="callname">${esc(d.name)}</b>
      <span class="callnote">\u0414\u0437\u0432\u0456\u043D\u043E\u043A \u0447\u0435\u0440\u0435\u0437 \u0437\u0430\u0445\u0438\u0449\u0435\u043D\u0438\u0439 \u043D\u043E\u043C\u0435\u0440\u2026</span>
      <button class="endcall" data-act="end-call" aria-label="\u0417\u0430\u0432\u0435\u0440\u0448\u0438\u0442\u0438 \u0434\u0437\u0432\u0456\u043D\u043E\u043A">${Icons.phone}</button></div>`;
    }
  };

export { CallOverlay };
