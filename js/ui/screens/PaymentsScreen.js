import { PaymentList } from "../PaymentList.js";
import { Screen } from "./Screen.js";

  var PaymentsScreen = class extends Screen {
    static id = "payments";
    get isFullSheet() {
      return true;
    }
    get showTraffic() {
      return false;
    }
    topBar() {
      return "";
    }
    content() {
      const passenger = this.app.catalog.passenger;
      return `${this.header("\u041E\u043F\u043B\u0430\u0442\u0430")}${PaymentList.render(passenger.paymentMethods, passenger.defaultPaymentId)}`;
    }
    handle(action, el) {
      if (action === "set-payment") {
        this.app.setPaymentMethod(el.value);
        return true;
      }
      return false;
    }
  };

export { PaymentsScreen };
