

  var PromoCode = class {
    constructor({ code, discountPct, validUntil }) {
      this.code = code;
      this.discountPct = discountPct;
      this.validUntil = /* @__PURE__ */ new Date(`${validUntil}T23:59:59`);
    }
    isValid(date = /* @__PURE__ */ new Date()) {
      return date <= this.validUntil;
    }
    /** Ціна після знижки (ціле число гривень). */
    apply(price, date = /* @__PURE__ */ new Date()) {
      if (!this.isValid(date)) return price;
      return Math.round(price * (1 - this.discountPct / 100));
    }
  };

export { PromoCode };
