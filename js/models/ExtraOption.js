

  var ExtraOption = class {
    constructor({ id, name, description, surcharge = 0, variants = null }) {
      this.id = id;
      this.name = name;
      this.description = description;
      this.surcharge = surcharge;
      this.variants = variants;
    }
    get isFree() {
      return this.surcharge === 0;
    }
    get priceLabel() {
      return this.isFree ? "\u0431\u0435\u0437\u043A\u043E\u0448\u0442\u043E\u0432\u043D\u043E" : `+${this.surcharge} \u20B4`;
    }
    /** Назва варіанта (наприклад, «Крісло 9–18 кг») або null. */
    variantLabel(key) {
      return this.variants?.[key] ?? null;
    }
  };

export { ExtraOption };
