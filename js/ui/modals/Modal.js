import { Icons } from "../Icons.js";

  var Modal = class {
    static id = "modal";
    /** @param {import('../../app/App.js').App} app */
    constructor(app2) {
      this.app = app2;
    }
    get id() {
      return this.constructor.id;
    }
    get title() {
      return "";
    }
    /** Викликається під час відкриття. */
    open(_params) {
    }
    body() {
      return "";
    }
    render() {
      return `<div class="backdrop" data-act="close-modal"></div>
      <div class="modal" role="dialog" aria-modal="true" aria-label="${this.title}">
        <div class="row"><h2 class="grow">${this.title}</h2><button class="roundbtn flat" data-act="close-modal" aria-label="\u0417\u0430\u043A\u0440\u0438\u0442\u0438">${Icons.close}</button></div>
        ${this.body()}
      </div>`;
    }
    mounted(_root) {
    }
    handle(_action, _el) {
      return false;
    }
  };

export { Modal };
