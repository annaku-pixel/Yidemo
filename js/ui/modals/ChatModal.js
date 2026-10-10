import { ChatMessage } from "../../models/ChatMessage.js";
import { Modal } from "./Modal.js";
import { esc } from "../html.js";

  var ChatModal = class _ChatModal extends Modal {
    static id = "chat";
    static QUICK_REPLIES = ["\u0412\u0436\u0435 \u0432\u0438\u0445\u043E\u0434\u0436\u0443", "\u0411\u0443\u0434\u0443 \u0437\u0430 2 \u0445\u0432\u0438\u043B\u0438\u043D\u0438", "\u042F \u0431\u0456\u043B\u044F \u043F\u0456\u0434\u2019\u0457\u0437\u0434\u0443 \u21162", "\u0414\u044F\u043A\u0443\u044E!"];
    get title() {
      return "\u0427\u0430\u0442 \u0437 \u0432\u043E\u0434\u0456\u0454\u043C";
    }
    body() {
      const messages = this.app.order.messages.map((m) => `<div class="msg ${m.author}">${esc(m.text)}</div>`).join("");
      return `<div class="chat" id="chatBox">${messages}</div>
      <div class="chips wrap">${_ChatModal.QUICK_REPLIES.map((q) => `<button class="chip" data-act="say" data-id="${q}">${q}</button>`).join("")}</div>`;
    }
    mounted() {
      document.getElementById("chatBox")?.lastElementChild?.scrollIntoView({ block: "nearest" });
    }
    handle(action, el) {
      if (action !== "say") return false;
      const order = this.app.order;
      const text = el.dataset.id;
      order.addMessage(ChatMessage.Author.PASSENGER, text);
      this.app.render();
      this.app.later(() => {
        order.addMessage(ChatMessage.Author.DRIVER, text === "\u0414\u044F\u043A\u0443\u044E!" ? "\u0413\u0430\u0440\u043D\u043E\u0433\u043E \u0434\u043D\u044F!" : "\u0414\u043E\u0431\u0440\u0435, \u0447\u0435\u043A\u0430\u044E");
        if (this.app.modal === this) this.app.render();
      }, 1200);
      return true;
    }
  };

export { ChatModal };
