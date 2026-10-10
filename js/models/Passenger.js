

  var Passenger = class {
    /**
     * @param {object} p
     * @param {import('./Place.js').Place[]} p.savedPlaces
     * @param {import('./PaymentMethod.js').PaymentMethod[]} p.paymentMethods
     */
    constructor({ id, name, initials, phone, rating, savedPlaces = [], paymentMethods = [], defaultPaymentId }) {
      this.id = id;
      this.name = name;
      this.initials = initials;
      this.phone = phone;
      this.rating = rating;
      this.savedPlaces = savedPlaces;
      this.paymentMethods = paymentMethods;
      this.defaultPaymentId = defaultPaymentId ?? paymentMethods[0]?.id;
    }
    get defaultPayment() {
      return this.paymentMethods.find((m) => m.id === this.defaultPaymentId);
    }
    setDefaultPayment(id) {
      if (!this.paymentMethods.some((m) => m.id === id)) throw new Error(`\u041D\u0435\u0432\u0456\u0434\u043E\u043C\u0438\u0439 \u0441\u043F\u043E\u0441\u0456\u0431 \u043E\u043F\u043B\u0430\u0442\u0438: ${id}`);
      this.defaultPaymentId = id;
    }
    paymentById(id) {
      return this.paymentMethods.find((m) => m.id === id);
    }
    savedPlace(label) {
      return this.savedPlaces.find((p) => p.label === label);
    }
  };

export { Passenger };
