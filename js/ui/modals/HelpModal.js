import { Modal } from "./Modal.js";

  var HelpModal = class extends Modal {
    static id = "help";
    get title() {
      return "\u042F\u043A \u0437\u0430\u043C\u043E\u0432\u0438\u0442\u0438 \u0442\u0430\u043A\u0441\u0456";
    }
    body() {
      return `<ol class="steps">${this.app.scenario.renderItems()}</ol>
      <label class="switch"><input type="checkbox" data-act="toggle-hints" ${this.app.hintsEnabled ? "checked" : ""}> \u041F\u043E\u043A\u0430\u0437\u0443\u0432\u0430\u0442\u0438 \u043F\u0456\u0434\u043A\u0430\u0437\u043A\u0438</label>
      <button class="secondary" data-act="reset">\u041F\u043E\u0447\u0430\u0442\u0438 \u0441\u043F\u043E\u0447\u0430\u0442\u043A\u0443</button>`;
    }
  };

export { HelpModal };
