import { Icons } from "./Icons.js";
import { esc } from "./html.js";

  var MenuDrawer = class _MenuDrawer {
    /** @param {import('../app/App.js').App} app */
    constructor(app2) {
      this.app = app2;
      this.isOpen = false;
    }
    open() {
      this.isOpen = true;
    }
    close() {
      this.isOpen = false;
    }
    render() {
      if (!this.isOpen) return "";
      const p = this.app.catalog.passenger;
      const item = (act, id, icon, title, sub) => `<button class="item" data-act="${act}" data-id="${id}"><span class="ico">${icon}</span><div><b>${title}</b><span>${sub}</span></div><span></span></button>`;
      const count = this.app.history.list().length;
      return `<div class="backdrop" data-act="close-drawer"></div>
      <nav class="drawer" aria-label="\u041C\u0435\u043D\u044E">
        <div class="me"><span class="avatar">${p.initials}</span><div><b>${esc(p.name)}</b><div class="sub">${p.phone} \xB7 ${Icons.starSmall} ${p.rating.toFixed(1).replace(".", ",")}</div></div></div>
        ${item("nav", "history", Icons.history, "\u0406\u0441\u0442\u043E\u0440\u0456\u044F \u043F\u043E\u0457\u0437\u0434\u043E\u043A", `${count} ${_MenuDrawer.tripsWord(count)}`)}
        ${item("nav", "places", Icons.home, "\u041C\u043E\u0457 \u0430\u0434\u0440\u0435\u0441\u0438", p.savedPlaces.map((s) => s.label).join(", "))}
        ${item("nav", "payments", Icons.card, "\u041E\u043F\u043B\u0430\u0442\u0430", esc(p.defaultPayment.title))}
        ${item("modal", "help", Icons.help, "\u042F\u043A \u0437\u0430\u043C\u043E\u0432\u0438\u0442\u0438 \u0442\u0430\u043A\u0441\u0456", "\u041F\u043E\u043A\u0440\u043E\u043A\u043E\u0432\u0430 \u043F\u0456\u0434\u043A\u0430\u0437\u043A\u0430")}
      </nav>`;
    }
    /** Узгодження слова «поїздка» з числом. */
    static tripsWord(n) {
      const m10 = n % 10, m100 = n % 100;
      if (m10 === 1 && m100 !== 11) return "\u043F\u043E\u0457\u0437\u0434\u043A\u0430";
      if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return "\u043F\u043E\u0457\u0437\u0434\u043A\u0438";
      return "\u043F\u043E\u0457\u0437\u0434\u043E\u043A";
    }
    handle(action, el) {
      if (action === "nav") {
        this.close();
        this.app.navigate(el.dataset.id);
        return true;
      }
      if (action === "close-drawer") {
        this.close();
        this.app.render();
        return true;
      }
      return false;
    }
  };

export { MenuDrawer };
