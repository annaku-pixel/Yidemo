import { Icons } from "../Icons.js";
import { Screen } from "./Screen.js";
import { esc } from "../html.js";

  var HomeScreen = class extends Screen {
    static id = "home";
    get showLocateButton() {
      return true;
    }
    content() {
      const { app: app2 } = this;
      const pickup = app2.pickup;
      const saved = app2.catalog.passenger.savedPlaces.filter((p) => !p.equals(pickup));
      const recent = app2.history.recentPlaceIds(pickup.id).map((id) => app2.geocoder.byId(id)).filter((p) => p && !p.isSaved).slice(0, 3);
      return `${this.hint()}
      <button class="from-line" data-act="edit-from"><span class="dot"></span><span class="ellipsis">\u0417\u0432\u0456\u0434\u043A\u0438: <b>${esc(pickup.name)}</b></span></button>
      <button class="where" data-act="search-to">${Icons.search}<span>\u041A\u0443\u0434\u0438 \u0457\u0434\u0435\u043C\u043E?</span></button>
      <div class="chips">${saved.map((p) => `<button class="chip" data-act="quick" data-id="${p.id}">${Icons.byName(p.icon)}${esc(p.label)}</button>`).join("")}</div>
      <div><h3>\u041D\u0435\u0449\u043E\u0434\u0430\u0432\u043D\u0456</h3><div class="list">${recent.map((p) => this.placeItem(p, "quick")).join("")}</div></div>`;
    }
    mapOverlay() {
      return { from: this.app.pickup, fromEffect: "halo" };
    }
    fitMap(map) {
      map.centerOn(this.app.pickup.x, this.app.pickup.y, 0.75);
    }
    handle(action, el) {
      switch (action) {
        case "search-to":
          this.app.navigate("search", { field: "to" });
          return true;
        case "edit-from":
          this.app.navigate("search", { field: "from" });
          return true;
        case "quick":
          this.app.chooseDestination(this.app.geocoder.byId(el.dataset.id));
          return true;
        default:
          return false;
      }
    }
  };

export { HomeScreen };
