

  var ScenarioTracker = class {
    /** @param {Array<{title:string, note:string}>} steps */
    constructor(steps) {
      this.steps = steps;
      this.done = /* @__PURE__ */ new Set();
    }
    complete(index) {
      this.done.add(index);
    }
    undo(...indexes) {
      indexes.forEach((i) => this.done.delete(i));
    }
    isDone(index) {
      return this.done.has(index);
    }
    /** Індекс поточного (першого невиконаного) кроку або -1. */
    get current() {
      return this.steps.findIndex((_, i) => !this.done.has(i));
    }
    get isFinished() {
      return this.done.size === this.steps.length;
    }
    reset() {
      this.done.clear();
    }
    renderItems() {
      const cur = this.current;
      return this.steps.map((s, i) => {
        const state = this.done.has(i) ? "done" : i === cur ? "cur" : "";
        return `<li class="${state}"><span class="n">${this.done.has(i) ? "\u2713" : i + 1}</span><div><b>${s.title}</b><small>${s.note}</small></div></li>`;
      }).join("");
    }
  };

export { ScenarioTracker };
