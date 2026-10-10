import { Icons } from "../Icons.js";
import { Screen } from "./Screen.js";
import { esc } from "../html.js";
import { uah } from "../html.js";

  var TariffScreen = class extends Screen {
    static id = "tariff";
    get showLocateButton() {
      return true;
    }
    topBar() {
      return this.bar(this.backButton("edit-to"), this.helpButton());
    }
    content() {
      const { app: app2 } = this;
      const order = app2.order;
      const quotes = app2.orders.quotes(order);
      const current = quotes.find((q) => q.tariff.id === order.tariff.id);
      const optionsLabel = order.selectedOptions.length ? order.selectedOptions.map((o) => o.id === "child" ? "\u041A\u0440\u0456\u0441\u043B\u043E" : o.name.split(" ")[0]).join(", ") : "\u041D\u0435\u043C\u0430\u0454";
      const actionLabel = order.scheduledAt ? "\u0417\u0430\u043F\u043B\u0430\u043D\u0443\u0432\u0430\u0442\u0438" : "\u0417\u0430\u043C\u043E\u0432\u0438\u0442\u0438";
      return `${this.hint()}
      <div class="routebar"><span class="dot"></span><span class="ellipsis" style="max-width:34%">${esc(order.from.title)}</span><span aria-hidden="true">\u2192</span><span class="dot b"></span><b class="ellipsis grow">${esc(order.to.title)}</b><span class="km">${order.route.kmLabel} \xB7 ${current.rideMin} \u0445\u0432</span></div>
      <div class="tariffs" role="radiogroup" aria-label="\u0422\u0430\u0440\u0438\u0444">${quotes.map((q) => `
        <button class="tariff" role="radio" aria-pressed="${q.tariff.id === order.tariff.id}" aria-checked="${q.tariff.id === order.tariff.id}" data-act="tariff" data-id="${q.tariff.id}">
          <span class="tn">${q.tariff.name}</span><span class="tp">${uah(q.price)}</span><span class="te">\u043F\u043E\u0434\u0430\u0447\u0430 ${q.pickupMin} \u0445\u0432</span></button>`).join("")}</div>
      <div class="prefs">
        <button class="pref" data-act="modal" data-id="payment"><small>\u041E\u043F\u043B\u0430\u0442\u0430</small><span>${esc(order.paymentMethod.short)}</span></button>
        <button class="pref ${order.selectedOptions.length ? "on" : ""}" data-act="modal" data-id="options"><small>\u041F\u043E\u0431\u0430\u0436\u0430\u043D\u043D\u044F</small><span>${optionsLabel}</span></button>
        <button class="pref" data-act="modal" data-id="schedule"><small>\u041A\u043E\u043B\u0438</small><span>${order.scheduledAt ? `\u043E ${order.scheduledAt}` : "\u0417\u0430\u0440\u0430\u0437"}</span></button>
      </div>
      <div class="fixed">${Icons.lock}<span>\u0426\u0456\u043D\u0430 \u0444\u0456\u043A\u0441\u043E\u0432\u0430\u043D\u0430: ${order.tariff.carHint}. \u041D\u0435 \u0437\u043C\u0456\u043D\u0438\u0442\u044C\u0441\u044F \u043F\u0456\u0441\u043B\u044F \u0437\u0430\u043C\u043E\u0432\u043B\u0435\u043D\u043D\u044F.</span></div>
      <button class="primary" data-act="place-order">${actionLabel} \xB7 ${uah(current.price)}</button>`;
    }
    mapOverlay() {
      const o = this.app.order;
      return { route: o.route, from: o.from, to: o.to };
    }
    fitMap(map) {
      map.fit(this.app.order.route.points);
    }
    handle(action, el) {
      switch (action) {
        case "tariff":
          this.app.order.setTariff(this.app.catalog.tariff(el.dataset.id));
          this.app.render();
          return true;
        case "edit-to":
          this.app.navigate("search", { field: "to" });
          return true;
        case "place-order":
          this.app.placeOrder();
          return true;
        default:
          return false;
      }
    }
  };

export { TariffScreen };
