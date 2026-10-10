import { Screen } from "./Screen.js";
import { esc } from "../html.js";
import { svg } from "../Icons.js";

  var PickOnMapScreen = class extends Screen {
    static id = "pick";
    get showTraffic() {
      return false;
    }
    enter({ field = "to" } = {}) {
      this.field = field;
      this.place = null;
    }
    topBar() {
      return this.bar(this.backButton("pick-cancel"), this.helpButton());
    }
    content() {
      return `${this.hint()}<h3>${this.field === "from" ? "\u0417\u0432\u0456\u0434\u043A\u0438 \u0437\u0430\u0431\u0440\u0430\u0442\u0438" : "\u041A\u0443\u0434\u0438 \u0457\u0434\u0435\u043C\u043E"}</h3>
      <div class="pickaddr" id="pickAddr"><b>\u0412\u0438\u0437\u043D\u0430\u0447\u0430\u0454\u043C\u043E \u0430\u0434\u0440\u0435\u0441\u0443\u2026</b><span></span></div>
      <div class="row"><button class="secondary" data-act="pick-cancel" style="flex:1">\u0421\u043A\u0430\u0441\u0443\u0432\u0430\u0442\u0438</button>
      <button class="primary" id="pickDone" data-act="pick-done" style="flex:2" disabled>\u0413\u043E\u0442\u043E\u0432\u043E</button></div>`;
    }
    extraOverlay() {
      const fill = this.field === "from" ? "var(--ink)" : "var(--accent)";
      return `<div class="pin-center" id="pinC"><svg width="34" height="48" viewBox="0 0 34 48" aria-hidden="true"><path d="M17 47 C17 47 2 28 2 17 a15 15 0 0 1 30 0 C32 28 17 47 17 47z" fill="${fill}" stroke="var(--ink)" stroke-width="2.5"/><circle cx="17" cy="17" r="5.5" fill="var(--surface)"/></svg></div>`;
    }
    mounted() {
      const pin = document.getElementById("pinC");
      if (pin) pin.style.top = `${this.app.map.visibleCenterY() + 2}px`;
    }
    fitMap(map) {
      const p = this.field === "from" ? this.app.pickup : this.app.order?.to ?? this.app.pickup;
      map.centerOn(p.x, p.y, 1.1);
      this.app.later(() => this.onMapIdle(), 480);
    }
    onMapMove() {
      const label = document.getElementById("pickAddr");
      if (label) label.innerHTML = "<b>\u0412\u0438\u0437\u043D\u0430\u0447\u0430\u0454\u043C\u043E \u0430\u0434\u0440\u0435\u0441\u0443\u2026</b><span></span>";
    }
    onMapIdle() {
      const label = document.getElementById("pickAddr");
      if (!label) return;
      const c = this.app.map.centerPoint();
      this.place = this.app.geocoder.reverse(c.x, c.y);
      label.innerHTML = `<b>${esc(this.place.title)}</b><span>${esc(this.place.isSaved ? this.place.name : this.place.sub)}</span>`;
      document.getElementById("pickDone").disabled = false;
    }
    handle(action) {
      switch (action) {
        case "pick-cancel":
          this.app.navigate("search", { field: this.field });
          return true;
        case "pick-done":
          if (!this.place) return true;
          if (this.field === "from") {
            this.app.setPickup(this.place);
            if (this.app.order) this.app.chooseDestination(this.app.order.to);
            else this.app.navigate("search", { field: "to" });
          } else {
            this.app.chooseDestination(this.place);
          }
          return true;
        default:
          return false;
      }
    }
  };

export { PickOnMapScreen };
