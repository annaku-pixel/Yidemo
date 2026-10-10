import { Icons } from "../Icons.js";
import { Rating } from "../../models/Rating.js";
import { Screen } from "./Screen.js";
import { esc } from "../html.js";
import { uah } from "../html.js";

  var DoneScreen = class _DoneScreen extends Screen {
    static id = "done";
    static TIPS = [0, 10, 20, 50];
    enter() {
      this.stars = 0;
      this.tags = [];
      this.tip = 0;
    }
    content() {
      const o = this.app.order;
      const d = o.driver;
      const tags = Rating.tagsFor(this.stars);
      const intro = this.stars ? "" : `${this.hint()}<div class="okmark">${Icons.check}</div>`;
      const details = this.stars ? `
      <div class="chips wrap">${tags.map((t) => `<button class="chip" data-act="tag" data-id="${t}" aria-pressed="${this.tags.includes(t)}">${t}</button>`).join("")}</div>
      <div><h3 class="mb8">\u0427\u0430\u0439\u043E\u0432\u0456 \u0432\u043E\u0434\u0456\u044E</h3><div class="chips">${_DoneScreen.TIPS.map((v) => `<button class="chip" data-act="tip" data-n="${v}" aria-pressed="${this.tip === v}">${v ? uah(v) : "\u0411\u0435\u0437 \u0447\u0430\u0439\u043E\u0432\u0438\u0445"}</button>`).join("")}</div></div>` : "";
      return `${intro}
      <h2 class="center">\u0412\u0438 \u043D\u0430 \u043C\u0456\u0441\u0446\u0456 \u043E ${this.app.clock.format()}</h2>
      <div class="summary"><div class="row"><span>${esc(o.to.fullTitle)}</span></div>
        <div class="row"><span>\u0421\u043F\u043B\u0430\u0447\u0435\u043D\u043E: ${esc(o.paymentMethod.title)}</span><span>${uah(o.price + this.tip)}</span></div></div>
      <p class="center question">\u042F\u043A \u0432\u0430\u043C \u043F\u043E\u0457\u0437\u0434\u043A\u0430 \u0437 ${esc(d.nameInstrumental)}?</p>
      <div class="stars" role="radiogroup" aria-label="\u041E\u0446\u0456\u043D\u043A\u0430">${[1, 2, 3, 4, 5].map((n) => `<button class="star ${n <= this.stars ? "on" : ""}" data-act="rate" data-n="${n}" aria-label="${n} \u0437 5">${Icons.star}</button>`).join("")}</div>
      ${details}
      <button class="primary" data-act="send-rating" ${this.stars ? "" : "disabled"}>\u041D\u0430\u0434\u0456\u0441\u043B\u0430\u0442\u0438 \u043E\u0446\u0456\u043D\u043A\u0443</button>`;
    }
    mapOverlay() {
      const o = this.app.order;
      return { from: o.from, to: o.to, car: this.app.simulator.carPosition };
    }
    fitMap(map) {
      map.fit(this.app.order.route.points);
    }
    handle(action, el) {
      switch (action) {
        case "rate":
          this.stars = Number(el.dataset.n);
          this.tags = [];
          this.app.render();
          return true;
        case "tag": {
          const t = el.dataset.id;
          this.tags = this.tags.includes(t) ? this.tags.filter((x) => x !== t) : [...this.tags, t];
          this.app.render();
          return true;
        }
        case "tip":
          this.tip = Number(el.dataset.n);
          this.app.render();
          return true;
        case "send-rating":
          this.app.submitRating(new Rating(this.stars, this.tags), this.tip);
          return true;
        default:
          return false;
      }
    }
  };

export { DoneScreen };
