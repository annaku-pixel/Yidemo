import { Car } from "../models/Car.js";
import { Driver } from "../models/Driver.js";
import { ExtraOption } from "../models/ExtraOption.js";
import { Passenger } from "../models/Passenger.js";
import { PaymentMethod } from "../models/PaymentMethod.js";
import { Place } from "../models/Place.js";
import { PromoCode } from "../models/PromoCode.js";
import { Tariff } from "../models/Tariff.js";

  var Catalog = class {
    constructor(seed) {
      this.places = seed.PLACES.map((p2) => new Place(p2));
      this.tariffs = seed.TARIFFS.map((t) => new Tariff(t));
      this.options = seed.OPTIONS.map((o) => new ExtraOption(o));
      this.paymentMethods = seed.PAYMENT_METHODS.map((m) => new PaymentMethod(m));
      this.drivers = seed.DRIVERS.map((d) => new Driver({ ...d, car: new Car(d.car) }));
      this.promoCodes = seed.PROMO_CODES.map((p2) => new PromoCode(p2));
      const p = seed.PASSENGER;
      this.passenger = new Passenger({
        ...p,
        savedPlaces: p.savedPlaceIds.map((id) => this.place(id)),
        paymentMethods: this.paymentMethods
      });
    }
    place(id) {
      return this.places.find((p) => p.id === id) ?? null;
    }
    tariff(id) {
      return this.tariffs.find((t) => t.id === id) ?? null;
    }
    option(id) {
      return this.options.find((o) => o.id === id) ?? null;
    }
    promo(code) {
      return this.promoCodes.find((p) => p.code === code.toUpperCase()) ?? null;
    }
    get defaultTariff() {
      return this.tariff("std");
    }
  };

export { Catalog };
