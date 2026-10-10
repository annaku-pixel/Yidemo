import { Screen } from "./Screen.js";
import { esc } from "../html.js";
import { uah } from "../html.js";

  var SearchingScreen = class extends Screen {
    static id = "searching";
    content() {
      const o = this.app.order;
      return `${this.hint()}<h2>\u0428\u0443\u043A\u0430\u0454\u043C\u043E \u0432\u043E\u0434\u0456\u044F${o.hasOption("child") ? " \u0437 \u0434\u0438\u0442\u044F\u0447\u0438\u043C \u043A\u0440\u0456\u0441\u043B\u043E\u043C" : ""}\u2026</h2>
      <div class="progress indet"><i></i></div>
      <div class="summary">
        <div class="row"><span class="dot"></span><span class="ellipsis grow">${esc(o.from.name)}</span></div>
        <div class="row"><span class="dot b"></span><span class="ellipsis grow">${esc(o.to.fullTitle)}</span></div>
        <div class="row"><span>${o.tariff.name} \xB7 ${esc(o.paymentMethod.short)}</span><span>${uah(o.price)}</span></div>
      </div>
      <button class="danger-btn" data-act="modal" data-id="cancel">\u0421\u043A\u0430\u0441\u0443\u0432\u0430\u0442\u0438 \u043F\u043E\u0448\u0443\u043A</button>`;
    }
    mapOverlay() {
      const o = this.app.order;
      return { route: o.route, from: o.from, to: o.to, fromEffect: "pulse" };
    }
    fitMap(map) {
      map.fit(this.app.order.route.points);
    }
  };

export { SearchingScreen };
