import { Place } from "../models/Place.js";

  var Geocoder = class {
    /**
     * @param {import('./CityMap.js').CityMap} cityMap
     * @param {Place[]} places відомі місця
     * @param {number} snapRadius радіус «прилипання» до відомого місця
     */
    constructor(cityMap, places, snapRadius) {
      this.cityMap = cityMap;
      this.places = places;
      this.snapRadius = snapRadius;
      this.custom = /* @__PURE__ */ new Map();
    }
    byId(id) {
      return this.places.find((p) => p.id === id) ?? this.custom.get(id) ?? null;
    }
    /** Пошук за текстом серед відомих місць. */
    search(query, limit = 8) {
      return this.places.filter((p) => p.matches(query)).slice(0, limit);
    }
    /**
     * Зворотне геокодування: точка карти → адреса.
     * Якщо поруч є відоме місце — повертаємо його, інакше створюємо адресу «вулиця, номер».
     */
    reverse(x, y) {
      const s = this.cityMap.snapToStreet(x, y);
      const near = this.places.find((p) => Math.hypot(p.x - s.x, p.y - s.y) < this.snapRadius);
      if (near) return near;
      const id = `pt_${s.x}_${s.y}`;
      if (!this.custom.has(id)) {
        const house = Math.max(1, Math.round(s.along / 18));
        this.custom.set(id, new Place({ id, name: `${s.street}, ${house}`, sub: "\u041E\u0431\u0440\u0430\u043D\u043E \u043D\u0430 \u043A\u0430\u0440\u0442\u0456", x: s.x, y: s.y }));
      }
      return this.custom.get(id);
    }
  };

export { Geocoder };
