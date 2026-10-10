import { Modal } from "./Modal.js";
import { SimClock } from "../../core/SimClock.js";

  var ScheduleModal = class extends Modal {
    static id = "schedule";
    get title() {
      return "\u041A\u043E\u043B\u0438 \u043F\u043E\u0434\u0430\u0442\u0438 \u0430\u0432\u0442\u043E";
    }
    /** Найближчі слоти з кроком 15 хвилин. */
    slots() {
      const now = this.app.clock.minutes;
      return [30, 60, 90, 120, 600].map((d) => SimClock.hhmm(Math.ceil((now + d) / 15) * 15));
    }
    body() {
      const current = this.app.order.scheduledAt;
      const chip = (id, label) => `<button class="chip" data-act="schedule" data-id="${id}" aria-pressed="${(current ?? "now") === id}">${label}</button>`;
      return `<div class="chips wrap">${chip("now", "\u0417\u0430\u0440\u0430\u0437")}${this.slots().map((s) => chip(s, `\u0421\u044C\u043E\u0433\u043E\u0434\u043D\u0456 \u043E ${s}`)).join("")}</div>
      <button class="primary" data-act="close-modal">\u0413\u043E\u0442\u043E\u0432\u043E</button>`;
    }
    handle(action, el) {
      if (action === "schedule") {
        this.app.order.schedule(el.dataset.id === "now" ? null : el.dataset.id);
        this.app.render();
        return true;
      }
      return false;
    }
  };

export { ScheduleModal };
