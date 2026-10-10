import { Icons } from "../Icons.js";
import { Screen } from "./Screen.js";
import { esc } from "../html.js";

  var SearchScreen = class extends Screen {
    static id = "search";
    get isFullSheet() {
      return true;
    }
    get showTraffic() {
      return false;
    }
    enter({ field = "to" } = {}) {
      this.field = field;
      this.query = "";
    }
    topBar() {
      return "";
    }
    content() {
      const { pickup, order } = this.app;
      const value = (f, place) => this.field === f ? esc(this.query) : esc(place?.name ?? "");
      return `${this.header("\u041C\u0430\u0440\u0448\u0440\u0443\u0442")}${this.hint()}
      <div class="fields"><div class="rail"><span class="dot"></span><span class="dot b"></span></div>
        <input id="fFrom" aria-label="\u0417\u0432\u0456\u0434\u043A\u0438" placeholder="\u0417\u0432\u0456\u0434\u043A\u0438" value="${value("from", pickup)}" data-field="from" autocomplete="off">
        <input id="fTo" aria-label="\u041A\u0443\u0434\u0438" placeholder="\u041A\u0443\u0434\u0438 \u0457\u0434\u0435\u043C\u043E?" value="${value("to", order?.to)}" data-field="to" autocomplete="off"></div>
      <button class="linkrow" data-act="pick-on-map">${Icons.map} \u0412\u043A\u0430\u0437\u0430\u0442\u0438 \u043D\u0430 \u043A\u0430\u0440\u0442\u0456</button>
      <div class="list" id="results">${this.results()}</div>`;
    }
    results() {
      const { app: app2 } = this;
      const q = this.query.trim();
      if (!q) {
        const saved = app2.catalog.passenger.savedPlaces;
        const recent = app2.history.recentPlaceIds(null).map((id) => app2.geocoder.byId(id)).filter((p) => p && !p.isSaved);
        const current = this.field === "from" ? `<button class="item" data-act="choose" data-id="home"><span class="ico">${Icons.locate}</span><div class="grow"><b>\u041C\u043E\u0454 \u043C\u0456\u0441\u0446\u0435\u0437\u043D\u0430\u0445\u043E\u0434\u0436\u0435\u043D\u043D\u044F</b><span>${esc(app2.catalog.place("home").name)}</span></div><span></span></button>` : "";
        return current + [...saved, ...recent].map((p) => this.placeItem(p, "choose")).join("");
      }
      const found = app2.geocoder.search(q);
      return found.length ? found.map((p) => this.placeItem(p, "choose")).join("") : `<p class="sub empty">\u041D\u0456\u0447\u043E\u0433\u043E \u043D\u0435 \u0437\u043D\u0430\u0439\u0434\u0435\u043D\u043E \u0437\u0430 \xAB${esc(q)}\xBB. \u0421\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u043D\u0430\u0437\u0432\u0443 \u0432\u0443\u043B\u0438\u0446\u0456 \u0430\u0431\u043E \u0432\u043A\u0430\u0436\u0456\u0442\u044C \u0442\u043E\u0447\u043A\u0443 \u043D\u0430 \u043A\u0430\u0440\u0442\u0456.</p>`;
    }
    mounted(root) {
      const input = root.querySelector(this.field === "from" ? "#fFrom" : "#fTo");
      input?.focus();
      input?.select();
    }
    #refreshResults() {
      const box = document.getElementById("results");
      if (box) box.innerHTML = this.results();
    }
    onInput(el) {
      if (!el.dataset.field) return;
      this.field = el.dataset.field;
      this.query = el.value;
      this.#refreshResults();
    }
    onFocus(el) {
      if (el.dataset.field && el.dataset.field !== this.field) {
        this.field = el.dataset.field;
        this.query = "";
        this.#refreshResults();
      }
    }
    onKey(e) {
      if (e.key === "Enter" && e.target.dataset?.field) {
        const first = document.querySelector('#results [data-act="choose"]');
        if (first) this.#choose(first.dataset.id);
      }
    }
    #choose(id) {
      const place = this.app.geocoder.byId(id);
      if (this.field === "from") {
        this.app.setPickup(place);
        if (this.app.order) return this.app.chooseDestination(this.app.order.to);
        this.field = "to";
        this.query = "";
        this.app.render();
        return;
      }
      this.app.chooseDestination(place);
    }
    handle(action, el) {
      switch (action) {
        case "choose":
          this.#choose(el.dataset.id);
          return true;
        case "pick-on-map":
          this.app.navigate("pick", { field: this.field });
          return true;
        default:
          return false;
      }
    }
  };

export { SearchScreen };
