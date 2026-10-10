import { Icons } from "../Icons.js";
import { Screen } from "./Screen.js";
import { esc } from "../html.js";
import { plate } from "../html.js";

  var RideScreen = class extends Screen {
    static id = "ride";
    get showTraffic() {
      return false;
    }
    get showLocateButton() {
      return true;
    }
    topBar() {
      return this.bar(this.menuButton(), '<button class="pillbtn sos" data-act="modal" data-id="sos">SOS</button>');
    }
    content() {
      const o = this.app.order;
      return `${this.hint()}
      <div class="row"><div class="grow"><p class="eta" id="etaLive">\u0423 \u0434\u043E\u0440\u043E\u0437\u0456 \xB7 \u0449\u0435 ${o.rideMin} \u0445\u0432</p>
        <p class="sub">\u041F\u0440\u0438\u0431\u0443\u0442\u0442\u044F \u043E ${this.app.clock.format(o.rideMin)} \xB7 ${esc(o.to.title)}</p></div>${plate(o.driver.car.plate)}</div>
      <div class="progress"><i id="rideBar"></i></div>
      <div class="btnrow three">
        <button class="act" data-act="modal" data-id="share">${Icons.share}\u041F\u043E\u0434\u0456\u043B\u0438\u0442\u0438\u0441\u044F</button>
        <button class="act" data-act="modal" data-id="chat">${Icons.chat}\u0427\u0430\u0442</button>
        <button class="act danger" data-act="modal" data-id="sos">${Icons.help}SOS</button></div>`;
    }
    mapOverlay() {
      const o = this.app.order;
      return { route: o.route, from: o.from, to: o.to, car: this.app.simulator.carPosition };
    }
    fitMap(map) {
      map.fit(this.app.order.route.points);
    }
    onTick({ phase, k, minutesLeft }) {
      if (phase !== "ride") return;
      const eta = document.getElementById("etaLive");
      if (eta) eta.textContent = `\u0423 \u0434\u043E\u0440\u043E\u0437\u0456 \xB7 \u0449\u0435 ${minutesLeft} \u0445\u0432`;
      const bar = document.getElementById("rideBar");
      if (bar) bar.style.width = `${(k * 100).toFixed(1)}%`;
    }
  };

export { RideScreen };
