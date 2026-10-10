

  var Tariff = class {
    constructor({ id, name, baseFare, perKm, pickupMin, carHint }) {
      this.id = id;
      this.name = name;
      this.baseFare = baseFare;
      this.perKm = perKm;
      this.pickupMin = pickupMin;
      this.carHint = carHint;
    }
    /**
     * Вартість поїздки: базова ціна + ціна за км × відстань + доплати за опції.
     * @param {number} km
     * @param {import('./ExtraOption.js').ExtraOption[]} options
     */
    priceFor(km, options = []) {
      const surcharges = options.reduce((sum, o) => sum + o.surcharge, 0);
      return Math.round(this.baseFare + this.perKm * km + surcharges);
    }
    /** Час подачі з урахуванням опцій (авто з кріслом шукати трохи довше). */
    pickupEta(options = []) {
      return this.pickupMin + (options.some((o) => o.id === "child") ? 1 : 0);
    }
  };

export { Tariff };
