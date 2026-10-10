

  var HistoryRepository = class {
    /**
     * @param {Array<{fromId:string, toId:string, when:string, tariffId:string, price:number, optionIds:string[]}>} seed
     */
    constructor(seed = []) {
      this.entries = seed.map((e) => ({ ...e }));
    }
    list() {
      return this.entries;
    }
    get(index) {
      return this.entries[index];
    }
    /** @param {import('../models/Order.js').Order} order */
    addFromOrder(order, when) {
      this.entries.unshift({
        fromId: order.from.id,
        toId: order.to.id,
        when,
        tariffId: order.tariff.id,
        price: order.total,
        optionIds: [...order.options.keys()]
      });
    }
    /** Нещодавні місця (без збережених і без поточної адреси подачі). */
    recentPlaceIds(excludeId) {
      const ids = this.entries.flatMap((e) => [e.toId, e.fromId]);
      return [...new Set(ids)].filter((id) => id !== excludeId);
    }
  };

export { HistoryRepository };
