import { Icons } from "../Icons.js";
import { OrderStatus } from "../../models/OrderStatus.js";
import { Screen } from "./Screen.js";
import { esc } from "../html.js";
import { plate } from "../html.js";
import { uah } from "../html.js";

  var DriverScreen = class extends Screen {
    static id = "driver";
    get showTraffic() {
      return false;
    }
    get showLocateButton() {
      return !this.arrived;
    }
    get arrived() {
      return this.app.order?.status === OrderStatus.DRIVER_ARRIVED;
    }
    get hintKey() {
      return this.arrived ? "arrived" : "driver";
    }
    content() {
      const { app: app2 } = this;
      const o = app2.order, d = o.driver;
      const seat = o.hasOption("child") ? app2.catalog.option("child").variantLabel(o.optionVariant("child")) : null;
      const otherOptions = o.selectedOptions.filter((x) => x.id !== "child");
      const title = this.arrived ? "\u0412\u043E\u0434\u0456\u0439 \u043D\u0430 \u043C\u0456\u0441\u0446\u0456" : `\u041F\u0440\u0438\u0431\u0443\u0434\u0435 \u0447\u0435\u0440\u0435\u0437 ${o.etaMin} \u0445\u0432`;
      const subtitle = this.arrived ? `\u0411\u0435\u0437\u043A\u043E\u0448\u0442\u043E\u0432\u043D\u0435 \u043E\u0447\u0456\u043A\u0443\u0432\u0430\u043D\u043D\u044F \u0434\u043E ${app2.clock.format(app2.config.FREE_WAIT_MIN)}` : d.car.description;
      return `${this.hint()}
      <div class="row"><div class="grow"><p class="eta" id="etaLive">${title}</p><p class="sub">${subtitle}</p></div>${plate(d.car.plate)}</div>
      <div class="driver"><span class="avatar">${d.initials}</span><div><b>${esc(d.name)}</b><div class="sub">${Icons.starSmall} ${d.ratingLabel} \xB7 ${d.tripsLabel} \u043F\u043E\u0457\u0437\u0434\u043E\u043A</div></div><span></span></div>
      <div class="badges">${seat ? `<span class="badge">${Icons.seat} ${seat} \u0432\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u0435</span>` : ""}${otherOptions.map((x) => `<span class="badge">${x.name}</span>`).join("")}<span class="badge warn">${uah(o.price)} \xB7 ${esc(o.paymentMethod.short)}</span></div>
      <div class="btnrow">
        <button class="act" data-act="modal" data-id="chat">${Icons.chat}\u0427\u0430\u0442</button>
        <button class="act" data-act="call">${Icons.phone}\u0414\u0437\u0432\u0456\u043D\u043E\u043A</button>
        <button class="act" data-act="modal" data-id="share">${Icons.share}\u041F\u043E\u0434\u0456\u043B\u0438\u0442\u0438\u0441\u044F</button>
        <button class="act danger" data-act="modal" data-id="cancel">${Icons.cancel}\u0421\u043A\u0430\u0441\u0443\u0432\u0430\u0442\u0438</button></div>
      ${this.arrived ? '<button class="primary" data-act="board">\u042F \u0432 \u0430\u0432\u0442\u043E \u2014 \u0457\u0434\u0435\u043C\u043E</button>' : ""}`;
    }
    mapOverlay() {
      const o = this.app.order;
      return { route: o.route, approach: this.arrived ? null : o.approach, from: o.from, to: o.to, car: this.app.simulator.carPosition };
    }
    fitMap(map) {
      const o = this.app.order;
      if (this.arrived) map.centerOn(o.from.x, o.from.y, 1.2);
      else map.fit([...o.approach.points, ...o.route.points.slice(0, 2)], 1.3);
    }
    onTick({ phase, minutesLeft }) {
      if (phase !== "approach") return;
      const el = document.getElementById("etaLive");
      if (el) el.textContent = minutesLeft > 0 ? `\u041F\u0440\u0438\u0431\u0443\u0434\u0435 \u0447\u0435\u0440\u0435\u0437 ${minutesLeft} \u0445\u0432` : "\u041F\u0456\u0434\u2019\u0457\u0436\u0434\u0436\u0430\u0454";
    }
    handle(action) {
      if (action === "board") {
        this.app.board();
        return true;
      }
      return false;
    }
  };

export { DriverScreen };
