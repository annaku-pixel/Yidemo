import { Icons } from "../Icons.js";
import { Screen } from "./Screen.js";
import { esc } from "../html.js";

  var ScheduledScreen = class extends Screen {
    static id = "scheduled";
    content() {
      const o = this.app.order;
      return `<div class="okmark">${Icons.check}</div>
      <h2 class="center">\u041F\u043E\u0457\u0437\u0434\u043A\u0443 \u0437\u0430\u043F\u043B\u0430\u043D\u043E\u0432\u0430\u043D\u043E \u043D\u0430 ${o.scheduledAt}</h2>
      <p class="sub center">${esc(o.from.name)} \u2192 ${esc(o.to.title)}. \u041D\u0430\u0433\u0430\u0434\u0430\u0454\u043C\u043E \u0437\u0430 15 \u0445\u0432\u0438\u043B\u0438\u043D \u0456 \u043F\u043E\u0447\u043D\u0435\u043C\u043E \u043F\u043E\u0448\u0443\u043A \u0432\u043E\u0434\u0456\u044F \u0437\u0430\u0437\u0434\u0430\u043B\u0435\u0433\u0456\u0434\u044C.</p>
      <button class="primary" data-act="go-home">\u041D\u0430 \u0433\u043E\u043B\u043E\u0432\u043D\u0443</button>`;
    }
    mapOverlay() {
      const o = this.app.order;
      return { route: o.route, from: o.from, to: o.to };
    }
    fitMap(map) {
      map.fit(this.app.order.route.points);
    }
  };

export { ScheduledScreen };
