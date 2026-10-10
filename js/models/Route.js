

  var Route = class _Route {
    /**
     * @param {Array<[number, number]>} points вершини ламаної
     * @param {number} kmPerUnit масштаб карти
     */
    constructor(points, kmPerUnit) {
      this.points = points;
      this.kmPerUnit = kmPerUnit;
      this.length = _Route.polylineLength(points);
    }
    get km() {
      return this.length * this.kmPerUnit;
    }
    get kmLabel() {
      return `${this.km.toFixed(1).replace(".", ",")} \u043A\u043C`;
    }
    /** Орієнтовна тривалість поїздки, хв. */
    durationMin(speedKmh, overheadMin = 0, minMin = 0) {
      return Math.max(minMin, Math.round(this.km / speedKmh * 60) + overheadMin);
    }
    get start() {
      return this.points[0];
    }
    get end() {
      return this.points[this.points.length - 1];
    }
    /**
     * Точка на маршруті для частки шляху t ∈ [0; 1]
     * та кут напрямку руху (для повороту іконки авто).
     */
    pointAt(t) {
      const pts = this.points;
      let left = this.length * Math.min(1, Math.max(0, t));
      for (let i = 1; i < pts.length; i++) {
        const seg = _Route.segmentLength(pts[i - 1], pts[i]);
        if (left <= seg || i === pts.length - 1) {
          const k = seg ? Math.min(1, left / seg) : 0;
          const [x0, y0] = pts[i - 1];
          const [x1, y1] = pts[i];
          return { x: x0 + (x1 - x0) * k, y: y0 + (y1 - y0) * k, angle: Math.atan2(y1 - y0, x1 - x0) * 180 / Math.PI };
        }
        left -= seg;
      }
      const [x, y] = pts[0];
      return { x, y, angle: 0 };
    }
    toSvgPoints() {
      return this.points.map((p) => p.join(",")).join(" ");
    }
    static segmentLength(a, b) {
      return Math.hypot(b[0] - a[0], b[1] - a[1]);
    }
    static polylineLength(points) {
      let sum = 0;
      for (let i = 1; i < points.length; i++) sum += _Route.segmentLength(points[i - 1], points[i]);
      return sum;
    }
  };

export { Route };
