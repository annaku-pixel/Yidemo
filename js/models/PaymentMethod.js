

  var PaymentMethod = class {
    constructor({ id, type, title, short }) {
      this.id = id;
      this.type = type;
      this.title = title;
      this.short = short;
    }
    get isCashless() {
      return this.type !== "cash";
    }
    get note() {
      return this.isCashless ? "\u0421\u043F\u0438\u0441\u0430\u043D\u043D\u044F \u043F\u0456\u0441\u043B\u044F \u043F\u043E\u0457\u0437\u0434\u043A\u0438" : "\u0420\u043E\u0437\u0440\u0430\u0445\u0443\u043D\u043E\u043A \u0437 \u0432\u043E\u0434\u0456\u0454\u043C";
    }
  };

export { PaymentMethod };
