import { EventEmitter } from "../core/EventEmitter.js";

  var RideSimulator = class extends EventEmitter {
    static Phase = Object.freeze({ APPROACH: "approach", RIDE: "ride" });
    constructor() {
      super();
      this.active = null;
      this.carPosition = null;
    }
    get isRunning() {
      return Boolean(this.active);
    }
    /**
     * @param {string} phase      APPROACH — водій їде до пасажира, RIDE — поїздка
     * @param {import('../models/Route.js').Route} route
     * @param {number} durationMs тривалість анімації
     * @param {number} minutes    скільки «хвилин» симуляції відповідає анімації
     */
    start(phase, route, durationMs, minutes, now = performance.now()) {
      this.active = { phase, route, durationMs, minutes, startedAt: now };
      this.carPosition = route.pointAt(0);
    }
    stop() {
      this.active = null;
    }
    /** Повністю прибрати авто з карти. */
    reset() {
      this.active = null;
      this.carPosition = null;
    }
    tick(now) {
      const a = this.active;
      if (!a) return;
      const k = Math.min(1, (now - a.startedAt) / a.durationMs);
      this.carPosition = a.route.pointAt(k);
      this.emit("progress", { phase: a.phase, k, point: this.carPosition, minutesLeft: Math.max(0, Math.ceil(a.minutes * (1 - k))) });
      if (k >= 1) {
        this.active = null;
        this.emit("finish", { phase: a.phase, minutes: a.minutes });
      }
    }
  };

export { RideSimulator };
