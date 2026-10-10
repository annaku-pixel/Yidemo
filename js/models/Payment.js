

  var Payment = class _Payment {
    static Status = Object.freeze({ PENDING: "pending", PAID: "paid" });
    /**
     * @param {object} p
     * @param {import('./PaymentMethod.js').PaymentMethod} p.method
     * @param {number} p.amount сума за тарифом, грн
     * @param {number} [p.tip]  чайові, грн
     */
    constructor({ method, amount, tip = 0 }) {
      if (amount < 0) throw new Error("\u0421\u0443\u043C\u0430 \u043F\u043B\u0430\u0442\u0435\u0436\u0443 \u043D\u0435 \u043C\u043E\u0436\u0435 \u0431\u0443\u0442\u0438 \u0432\u0456\u0434\u2019\u0454\u043C\u043D\u043E\u044E");
      this.method = method;
      this.amount = amount;
      this.tip = tip;
      this.status = _Payment.Status.PENDING;
      this.paidAt = null;
    }
    get total() {
      return this.amount + this.tip;
    }
    setTip(tip) {
      this.tip = Math.max(0, tip);
    }
    /** Списати кошти (у прототипі — імітація). */
    capture() {
      this.status = _Payment.Status.PAID;
      this.paidAt = Date.now();
    }
  };

export { Payment };
