

  var Toast = class {
    /** @param {HTMLElement} host */
    constructor(host, durationMs = 2600) {
      this.host = host;
      this.durationMs = durationMs;
      this.timer = null;
    }
    show(message) {
      clearTimeout(this.timer);
      this.host.querySelector(".toast")?.remove();
      const el = document.createElement("div");
      el.className = "toast";
      el.setAttribute("role", "status");
      el.textContent = message;
      this.host.appendChild(el);
      this.timer = setTimeout(() => el.remove(), this.durationMs);
    }
  };

export { Toast };
