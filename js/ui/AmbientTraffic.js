import { SeededRandom } from "../core/SeededRandom.js";

  var AmbientTraffic = class {
    /**
     * @param {import('../services/CityMap.js').CityMap} cityMap
     * @param {Array<[number, number]>} startPoints
     */
    constructor(cityMap, startPoints, speed = 38) {
      this.cityMap = cityMap;
      this.speed = speed;
      this.rng = new SeededRandom(42);
      this.cars = startPoints.map(([x, y]) => this.#newTrip(cityMap.snapToStreet(x, y)));
    }
    #randomNode() {
      return { x: this.rng.pick(this.cityMap.xs), y: this.rng.pick(this.cityMap.ys) };
    }
    #newTrip(from) {
      return { route: this.cityMap.buildRoute(from, this.#randomNode()), t: 0 };
    }
    /** Просунути всі авто на dt секунд. */
    update(dt) {
      for (let i = 0; i < this.cars.length; i++) {
        const car = this.cars[i];
        car.t += dt * this.speed / Math.max(1, car.route.length);
        if (car.t >= 1) {
          const [x, y] = car.route.end;
          this.cars[i] = this.#newTrip({ x, y });
        }
      }
    }
    /** Поточні позиції авто: [{x, y, angle}]. */
    positions() {
      return this.cars.map((c) => c.route.pointAt(c.t));
    }
  };

export { AmbientTraffic };
