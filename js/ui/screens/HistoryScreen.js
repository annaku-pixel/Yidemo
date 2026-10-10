import { Icons } from "../Icons.js";
import { Screen } from "./Screen.js";
import { esc } from "../html.js";
import { uah } from "../html.js";

  var HistoryScreen = class extends Screen {
    static id = "history";
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
      const { app: app2 } = this;
      const rows = app2.history.list().map((e, i) => {
        const to = app2.geocoder.byId(e.toId);
        const tariff = app2.catalog.tariff(e.tariffId);
        const seat = e.optionIds.includes("child") ? " \xB7 \u043A\u0440\u0456\u0441\u043B\u043E" : "";
        return `<div class="item"><span class="ico">${Icons.history}</span><div class="grow"><b class="ellipsis">${esc(to.title)}</b><span class="ellipsis">${esc(e.when)} \xB7 ${tariff.name}${seat} \xB7 ${uah(e.price)}</span></div><button class="chip" data-act="repeat" data-n="${i}">\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u0438</button></div>`;
      }).join("");
      return `${this.header("\u0406\u0441\u0442\u043E\u0440\u0456\u044F \u043F\u043E\u0457\u0437\u0434\u043E\u043A")}<div class="list">${rows}</div>`;
    }
    handle(action, el) {
      if (action === "repeat") {
        this.app.repeatFromHistory(Number(el.dataset.n));
        return true;
      }
      return false;
    }
  };

export { HistoryScreen };
