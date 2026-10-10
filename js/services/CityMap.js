import { Route } from "../models/Route.js";

  var CityMap = class _CityMap {
    /**
     * @param {typeof import('../data/seed.js').GRID} grid
     * @param {{KM_PER_UNIT:number, CITY_SPEED_KMH:number, RIDE_OVERHEAD_MIN:number, MIN_RIDE_MIN:number}} config
     */
    constructor(grid, config) {
      this.grid = grid;
      this.config = config;
    }
    get xs() {
      return this.grid.xs;
    }
    get ys() {
      return this.grid.ys;
    }
    isMainStreet(coord, vertical) {
      return (vertical ? this.grid.mainX : this.grid.mainY).includes(coord);
    }
    streetName(coord, vertical) {
      return (vertical ? this.grid.vertical : this.grid.horizontal)[coord];
    }
    /** Чи лежить точка на перехресті. */
    isIntersection(p) {
      return this.xs.includes(p.x) && this.ys.includes(p.y);
    }
    /**
     * Найближчі перехрестя, до яких можна виїхати з точки на вулиці,
     * та відстань до кожного з них.
     * @returns {Array<{node:[number,number], dist:number}>}
     */
    exits(p) {
      if (this.isIntersection(p)) return [{ node: [p.x, p.y], dist: 0 }];
      const onHorizontal = this.ys.includes(p.y);
      const line = onHorizontal ? this.xs : this.ys;
      const pos = onHorizontal ? p.x : p.y;
      const make = (c) => ({ node: onHorizontal ? [c, p.y] : [p.x, c], dist: Math.abs(pos - c) });
      const i = line.findIndex((c) => c > pos);
      if (i === -1) return [make(line[line.length - 1])];
      if (i === 0) return [make(line[0])];
      return [make(line[i - 1]), make(line[i])];
    }
    /** Чи лежать дві точки на одному відрізку вулиці між сусідніми перехрестями. */
    sameSegment(a, b) {
      if (a.y === b.y && this.ys.includes(a.y)) {
        const [lo, hi] = [Math.min(a.x, b.x), Math.max(a.x, b.x)];
        return !this.xs.some((x) => x > lo && x < hi);
      }
      if (a.x === b.x && this.xs.includes(a.x)) {
        const [lo, hi] = [Math.min(a.y, b.y), Math.max(a.y, b.y)];
        return !this.ys.some((y) => y > lo && y < hi);
      }
      return false;
    }
    /**
     * Найкоротший маршрут вулицями між двома точками.
     * На прямокутній сітці найкоротший шлях між перехрестями — «Манхеттенський»:
     * перебираємо виїзди з A та в’їзди в B і обираємо пару з мінімальною сумарною довжиною.
     * @returns {Route}
     */
    buildRoute(a, b) {
      if (this.sameSegment(a, b)) return new Route([[a.x, a.y], [b.x, b.y]], this.config.KM_PER_UNIT);
      let best = null;
      for (const ea of this.exits(a)) {
        for (const eb of this.exits(b)) {
          const d = ea.dist + Math.abs(ea.node[0] - eb.node[0]) + Math.abs(ea.node[1] - eb.node[1]) + eb.dist;
          if (!best || d < best.d) best = { d, ea, eb };
        }
      }
      const [ax, ay] = best.ea.node;
      const [bx, by] = best.eb.node;
      const corner = Math.abs(bx - ax) >= Math.abs(by - ay) ? [bx, ay] : [ax, by];
      const points = _CityMap.simplify([[a.x, a.y], [ax, ay], corner, [bx, by], [b.x, b.y]]);
      return new Route(points, this.config.KM_PER_UNIT);
    }
    /** Тривалість поїздки маршрутом, хв. */
    rideMinutes(route) {
      const c = this.config;
      return route.durationMin(c.CITY_SPEED_KMH, c.RIDE_OVERHEAD_MIN, c.MIN_RIDE_MIN);
    }
    /**
     * «Прилипання» довільної точки до найближчої вулиці.
     * @returns {{x:number, y:number, street:string, along:number}}
     */
    snapToStreet(x, y) {
      const { xs, ys } = this;
      const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
      let best = null;
      for (const X of xs) {
        const d = Math.abs(x - X);
        if (!best || d < best.d) best = { d, x: X, y: clamp(y, ys[0] - 60, ys[ys.length - 1] + 60), street: this.streetName(X, true), along: y };
      }
      for (const Y of ys) {
        const d = Math.abs(y - Y);
        if (d < best.d) best = { d, x: clamp(x, xs[0] - 60, xs[xs.length - 1] + 60), y: Y, street: this.streetName(Y, false), along: x };
      }
      return { x: Math.round(best.x), y: Math.round(best.y), street: best.street, along: best.along };
    }
    /** Прибирає дублікати та проміжні точки на одній прямій. */
    static simplify(points) {
      const out = [];
      for (const p of points) {
        const last = out[out.length - 1];
        if (!last || last[0] !== p[0] || last[1] !== p[1]) out.push(p);
      }
      for (let i = out.length - 2; i > 0; i--) {
        const [p, q, r] = [out[i - 1], out[i], out[i + 1]];
        if (p[0] === q[0] && q[0] === r[0] || p[1] === q[1] && q[1] === r[1]) out.splice(i, 1);
      }
      return out;
    }
  };

export { CityMap };
