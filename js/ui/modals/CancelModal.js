import { Modal } from "./Modal.js";
import { OrderStatus } from "../../models/OrderStatus.js";

  var CancelModal = class _CancelModal extends Modal {
    static id = "cancel";
    static REASONS = ["\u0414\u043E\u0432\u0433\u043E \u0447\u0435\u043A\u0430\u0442\u0438", "\u0417\u043C\u0456\u043D\u0438\u043B\u0438\u0441\u044F \u043F\u043B\u0430\u043D\u0438", "\u041F\u043E\u043C\u0438\u043B\u0438\u043B\u0438\u0441\u044F \u0437 \u0430\u0434\u0440\u0435\u0441\u043E\u044E", "\u0406\u043D\u0448\u0430 \u043F\u0440\u0438\u0447\u0438\u043D\u0430"];
    get title() {
      return "\u0421\u043A\u0430\u0441\u0443\u0432\u0430\u0442\u0438 \u0437\u0430\u043C\u043E\u0432\u043B\u0435\u043D\u043D\u044F?";
    }
    open() {
      this.reason = null;
    }
    body() {
      const searching = this.app.order.status === OrderStatus.SEARCHING;
      const note = searching ? "\u0412\u043E\u0434\u0456\u044F \u0449\u0435 \u043D\u0435 \u0437\u043D\u0430\u0439\u0434\u0435\u043D\u043E \u2014 \u0441\u043A\u0430\u0441\u0443\u0432\u0430\u043D\u043D\u044F \u0431\u0435\u0437\u043A\u043E\u0448\u0442\u043E\u0432\u043D\u0435." : "\u0412\u043E\u0434\u0456\u0439 \u0443\u0436\u0435 \u0457\u0434\u0435. \u0421\u043A\u0430\u0441\u0443\u0432\u0430\u043D\u043D\u044F \u043F\u0440\u043E\u0442\u044F\u0433\u043E\u043C 2 \u0445\u0432\u0438\u043B\u0438\u043D \u043F\u0456\u0441\u043B\u044F \u043F\u0440\u0438\u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F \u0431\u0435\u0437\u043A\u043E\u0448\u0442\u043E\u0432\u043D\u0435.";
      return `<p class="sub">${note}</p>
      <div class="chips wrap">${_CancelModal.REASONS.map((r) => `<button class="chip" data-act="cancel-reason" data-id="${r}" aria-pressed="${this.reason === r}">${r}</button>`).join("")}</div>
      <button class="danger-btn" data-act="confirm-cancel">\u0422\u0430\u043A, \u0441\u043A\u0430\u0441\u0443\u0432\u0430\u0442\u0438</button>
      <button class="secondary" data-act="close-modal">\u041D\u0456, \u043F\u0440\u043E\u0434\u043E\u0432\u0436\u0438\u0442\u0438 \u043F\u043E\u0457\u0437\u0434\u043A\u0443</button>`;
    }
    handle(action, el) {
      switch (action) {
        case "cancel-reason":
          this.reason = el.dataset.id;
          this.app.render();
          return true;
        case "confirm-cancel":
          this.app.cancelOrder(this.reason);
          return true;
        default:
          return false;
      }
    }
  };

export { CancelModal };
