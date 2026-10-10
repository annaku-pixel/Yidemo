

  var DispatchService = class {
    /**
     * @param {import('../models/Driver.js').Driver[]} drivers
     * @param {import('./CityMap.js').CityMap} cityMap
     * @param {number} searchDelayMs імітація часу пошуку
     */
    constructor(drivers, cityMap, searchDelayMs) {
      this.drivers = drivers;
      this.cityMap = cityMap;
      this.searchDelayMs = searchDelayMs;
    }
    /** Найближчий відповідний водій або null (синхронно — для тестів). */
    pickDriver(order) {
      const from = order.from;
      const candidates = this.drivers.filter((d) => d.canServe(order)).map((d) => ({ driver: d, dist: Math.abs(d.position.x - from.x) + Math.abs(d.position.y - from.y) })).sort((a, b) => a.dist - b.dist);
      return candidates[0]?.driver ?? null;
    }
    /**
     * Асинхронний пошук водія з можливістю скасування.
     * @param {import('../models/Order.js').Order} order
     * @param {AbortSignal} [signal]
     * @returns {Promise<{driver: import('../models/Driver.js').Driver, approach: import('../models/Route.js').Route}>}
     */
    findDriver(order, signal) {
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          const driver = this.pickDriver(order);
          if (!driver) return reject(new Error("\u041F\u043E\u0440\u0443\u0447 \u043D\u0435\u043C\u0430\u0454 \u0432\u0456\u043B\u044C\u043D\u0438\u0445 \u0432\u043E\u0434\u0456\u0457\u0432 \u0437 \u043F\u043E\u0442\u0440\u0456\u0431\u043D\u0438\u043C\u0438 \u043E\u043F\u0446\u0456\u044F\u043C\u0438"));
          const start = this.cityMap.snapToStreet(driver.position.x, driver.position.y);
          resolve({ driver, approach: this.cityMap.buildRoute(start, order.from) });
        }, this.searchDelayMs);
        signal?.addEventListener("abort", () => {
          clearTimeout(timer);
          reject(new DOMException("\u041F\u043E\u0448\u0443\u043A \u0441\u043A\u0430\u0441\u043E\u0432\u0430\u043D\u043E", "AbortError"));
        });
      });
    }
  };

export { DispatchService };
