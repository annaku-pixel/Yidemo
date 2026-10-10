

  var EventEmitter = class {
    #handlers = /* @__PURE__ */ new Map();
    /** Підписатися на подію. Повертає функцію для відписки. */
    on(event, handler) {
      if (!this.#handlers.has(event)) this.#handlers.set(event, /* @__PURE__ */ new Set());
      this.#handlers.get(event).add(handler);
      return () => this.off(event, handler);
    }
    off(event, handler) {
      this.#handlers.get(event)?.delete(handler);
    }
    emit(event, payload) {
      for (const handler of this.#handlers.get(event) ?? []) handler(payload);
    }
  };

export { EventEmitter };
