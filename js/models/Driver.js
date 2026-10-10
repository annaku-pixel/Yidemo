

  var Driver = class _Driver {
    static Status = Object.freeze({ FREE: "free", BUSY: "busy" });
    /** @param {{car: import('./Car.js').Car}} p */
    constructor({ id, name, initials, rating, trips, phone, car, x, y }) {
      this.id = id;
      this.name = name;
      this.initials = initials;
      this.rating = rating;
      this.trips = trips;
      this.phone = phone;
      this.car = car;
      this.position = { x, y };
      this.status = _Driver.Status.FREE;
    }
    get isFree() {
      return this.status === _Driver.Status.FREE;
    }
    get ratingLabel() {
      return this.rating.toFixed(2).replace(".", ",");
    }
    get tripsLabel() {
      return this.trips.toLocaleString("uk-UA");
    }
    /** Ім’я в орудному відмінку для фрази «поїздка з …» (спрощено). */
    get nameInstrumental() {
      const n = this.name;
      if (n.endsWith("\u0430")) return n.slice(0, -1) + "\u043E\u044E";
      if (n.endsWith("\u0439")) return n.slice(0, -1) + "\u0454\u043C";
      return n + "\u043E\u043C";
    }
    /** Чи може водій виконати замовлення: вільний, потрібний клас авто, є крісло за потреби. */
    canServe(order) {
      if (!this.isFree) return false;
      if (!this.car.supportsTariff(order.tariff.id)) return false;
      if (order.hasOption("child") && !this.car.hasChildSeat) return false;
      return true;
    }
    occupy() {
      this.status = _Driver.Status.BUSY;
    }
    release(position) {
      this.status = _Driver.Status.FREE;
      if (position) this.position = { x: position.x, y: position.y };
    }
  };

export { Driver };
