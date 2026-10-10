import { Screen } from "./Screen.js";
import { esc } from "../html.js";

  var PlacesScreen = class extends Screen {
    static id = "places";
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
      const rows = this.app.catalog.passenger.savedPlaces.map((p) => `
      <div class="item">${this.placeIcon(p)}<div class="grow"><b>${esc(p.label)}</b><span class="ellipsis">${esc(p.name)} \xB7 ${esc(p.sub)}</span></div>
      <button class="chip" data-act="toast" data-msg="\u0420\u0435\u0434\u0430\u0433\u0443\u0432\u0430\u043D\u043D\u044F \u0430\u0434\u0440\u0435\u0441 \u0443 \u043F\u0440\u043E\u0442\u043E\u0442\u0438\u043F\u0456 \u043D\u0435 \u0440\u0435\u0430\u043B\u0456\u0437\u043E\u0432\u0430\u043D\u0435">\u0417\u043C\u0456\u043D\u0438\u0442\u0438</button></div>`).join("");
      return `${this.header("\u041C\u043E\u0457 \u0430\u0434\u0440\u0435\u0441\u0438")}<div class="list">${rows}</div>
      <button class="secondary" data-act="toast" data-msg="\u0414\u043E\u0434\u0430\u0432\u0430\u043D\u043D\u044F \u0430\u0434\u0440\u0435\u0441 \u0443 \u043F\u0440\u043E\u0442\u043E\u0442\u0438\u043F\u0456 \u043D\u0435 \u0440\u0435\u0430\u043B\u0456\u0437\u043E\u0432\u0430\u043D\u0435">+ \u0414\u043E\u0434\u0430\u0442\u0438 \u0430\u0434\u0440\u0435\u0441\u0443</button>`;
    }
  };

export { PlacesScreen };
