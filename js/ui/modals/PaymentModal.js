import { Modal } from "./Modal.js";
import { PaymentList } from "../PaymentList.js";

  var PaymentModal = class extends Modal {
    static id = "payment";
    get title() {
      return "\u0421\u043F\u043E\u0441\u0456\u0431 \u043E\u043F\u043B\u0430\u0442\u0438";
    }
    body() {
      const passenger = this.app.catalog.passenger;
      const selected = this.app.order?.paymentMethod.id ?? passenger.defaultPaymentId;
      return `${PaymentList.render(passenger.paymentMethods, selected)}<button class="primary" data-act="close-modal">\u0413\u043E\u0442\u043E\u0432\u043E</button>`;
    }
    handle(action, el) {
      if (action === "set-payment") {
        this.app.setPaymentMethod(el.value);
        return true;
      }
      return false;
    }
  };

export { PaymentModal };
