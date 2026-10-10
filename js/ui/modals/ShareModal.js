import { Modal } from "./Modal.js";
import { esc } from "../html.js";

  var ShareModal = class extends Modal {
    static id = "share";
    get title() {
      return "\u041F\u043E\u0434\u0456\u043B\u0438\u0442\u0438\u0441\u044F \u043F\u043E\u0457\u0437\u0434\u043A\u043E\u044E";
    }
    message() {
      const o = this.app.order, d = o.driver;
      return `\u042F \u0457\u0434\u0443 \u0432 \u0442\u0430\u043A\u0441\u0456: ${d.car.color} ${d.car.model}, ${d.car.plate}, \u0432\u043E\u0434\u0456\u0439 ${d.name}. \u041C\u0430\u0440\u0448\u0440\u0443\u0442: ${o.from.name} \u2192 ${o.to.name}. \u0421\u0442\u0435\u0436\u0438\u0442\u0438: yidemo.example/t/${o.id}`;
    }
    body() {
      return `<p class="sub">\u0411\u043B\u0438\u0437\u044C\u043A\u0456 \u0431\u0430\u0447\u0438\u0442\u0438\u043C\u0443\u0442\u044C \u0430\u0432\u0442\u043E \u043D\u0430 \u043A\u0430\u0440\u0442\u0456 \u0439 \u0447\u0430\u0441 \u043F\u0440\u0438\u0431\u0443\u0442\u0442\u044F, \u0434\u043E\u043A\u0438 \u043F\u043E\u0457\u0437\u0434\u043A\u0430 \u043D\u0435 \u0437\u0430\u0432\u0435\u0440\u0448\u0438\u0442\u044C\u0441\u044F.</p>
      <div class="copybox"><code id="shareText">${esc(this.message())}</code></div>
      <button class="primary" data-act="copy-share">\u0421\u043A\u043E\u043F\u0456\u044E\u0432\u0430\u0442\u0438 \u043F\u043E\u0432\u0456\u0434\u043E\u043C\u043B\u0435\u043D\u043D\u044F</button>`;
    }
    handle(action) {
      if (action !== "copy-share") return false;
      const text = this.message();
      const fallback = () => {
        const range = document.createRange();
        range.selectNodeContents(document.getElementById("shareText"));
        const sel = getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        this.app.toast("\u0422\u0435\u043A\u0441\u0442 \u0432\u0438\u0434\u0456\u043B\u0435\u043D\u043E \u2014 \u0441\u043A\u043E\u043F\u0456\u044E\u0439\u0442\u0435 \u0439\u043E\u0433\u043E \u0432\u0440\u0443\u0447\u043D\u0443");
      };
      try {
        navigator.clipboard.writeText(text).then(() => this.app.toast("\u041F\u043E\u0432\u0456\u0434\u043E\u043C\u043B\u0435\u043D\u043D\u044F \u0441\u043A\u043E\u043F\u0456\u0439\u043E\u0432\u0430\u043D\u043E \u2014 \u043D\u0430\u0434\u0456\u0448\u043B\u0456\u0442\u044C \u0439\u043E\u0433\u043E \u0432 \u043C\u0435\u0441\u0435\u043D\u0434\u0436\u0435\u0440\u0456"), fallback);
      } catch {
        fallback();
      }
      return true;
    }
  };

export { ShareModal };
