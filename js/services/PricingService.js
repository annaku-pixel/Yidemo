

  var PricingService = class {
    /**
     * @param {import('./CityMap.js').CityMap} cityMap
     * @param {import('../models/Tariff.js').Tariff[]} tariffs
     */
    constructor(cityMap, tariffs) {
      this.cityMap = cityMap;
      this.tariffs = tariffs;
    }
    /**
     * Пропозиція для одного тарифу.
     * @param {import('../models/Order.js').Order} order
     * @param {import('../models/Tariff.js').Tariff} [tariff] інший тариф для порівняння
     */
    quote(order, tariff = order.tariff) {
      const options = order.selectedOptions;
      let price = tariff.priceFor(order.route.km, options);
      if (order.promo) price = order.promo.apply(price);
      return {
        tariff,
        price,
        pickupMin: tariff.pickupEta(options),
        rideMin: this.cityMap.rideMinutes(order.route)
      };
    }
    /** Пропозиції для всіх тарифів — для екрана вибору. */
    quoteAll(order) {
      return this.tariffs.map((t) => this.quote(order, t));
    }
  };

export { PricingService };
