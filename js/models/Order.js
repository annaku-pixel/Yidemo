import { ChatMessage } from "./ChatMessage.js";
import { OrderStatus } from "./OrderStatus.js";
import { STATUS_LABELS } from "./OrderStatus.js";
import { canTransition } from "./OrderStatus.js";

  var nextId = 1;
  var Order = class {
    /**
     * @param {object} p
     * @param {import('./Passenger.js').Passenger} p.passenger
     * @param {import('./Place.js').Place} p.from
     * @param {import('./Place.js').Place} p.to
     * @param {import('./Route.js').Route} p.route
     * @param {import('./Tariff.js').Tariff} p.tariff
     * @param {import('./PaymentMethod.js').PaymentMethod} p.paymentMethod
     */
    constructor({ passenger, from, to, route, tariff, paymentMethod, createdAt = Date.now() }) {
      if (from.equals(to)) throw new Error("\u0410\u0434\u0440\u0435\u0441\u0430 \u043F\u0440\u0438\u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F \u0437\u0431\u0456\u0433\u0430\u0454\u0442\u044C\u0441\u044F \u0437 \u0430\u0434\u0440\u0435\u0441\u043E\u044E \u043F\u043E\u0434\u0430\u0447\u0456");
      this.id = `ord-${nextId++}`;
      this.passenger = passenger;
      this.from = from;
      this.to = to;
      this.route = route;
      this.tariff = tariff;
      this.paymentMethod = paymentMethod;
      this.createdAt = createdAt;
      this.options = /* @__PURE__ */ new Map();
      this.comment = "";
      this.scheduledAt = null;
      this.status = OrderStatus.DRAFT;
      this.price = null;
      this.driver = null;
      this.payment = null;
      this.rating = null;
      this.promo = null;
      this.cancelReason = null;
      this.messages = [];
      this.approach = null;
      this.etaMin = null;
      this.rideMin = null;
      this.log = [{ status: this.status, at: createdAt }];
    }
    // ---------- Опції ----------
    hasOption(id) {
      return this.options.has(id);
    }
    setOption(option, enabled, variant = null) {
      this.#assertDraft();
      if (enabled) this.options.set(option.id, { option, variant: variant ?? (option.variants ? Object.keys(option.variants)[0] : null) });
      else this.options.delete(option.id);
    }
    setOptionVariant(optionId, variant) {
      const entry = this.options.get(optionId);
      if (entry) entry.variant = variant;
    }
    optionVariant(optionId) {
      return this.options.get(optionId)?.variant ?? null;
    }
    get selectedOptions() {
      return [...this.options.values()].map((v) => v.option);
    }
    setTariff(tariff) {
      this.#assertDraft();
      this.tariff = tariff;
    }
    setPaymentMethod(method) {
      this.paymentMethod = method;
    }
    schedule(time) {
      this.#assertDraft();
      this.scheduledAt = time;
    }
    applyPromo(promo) {
      this.promo = promo;
    }
    // ---------- Життєвий цикл ----------
    /** Підтвердити замовлення: ціну зафіксовано, починається пошук або планування. */
    place(price) {
      this.price = price;
      this.#transition(this.scheduledAt ? OrderStatus.SCHEDULED : OrderStatus.SEARCHING);
    }
    assignDriver(driver) {
      this.#transition(OrderStatus.DRIVER_ASSIGNED);
      this.driver = driver;
      driver.occupy();
    }
    markDriverArrived() {
      this.#transition(OrderStatus.DRIVER_ARRIVED);
    }
    startRide() {
      this.#transition(OrderStatus.IN_PROGRESS);
    }
    /** @param {import('./Payment.js').Payment} payment */
    complete(payment) {
      this.#transition(OrderStatus.COMPLETED);
      this.payment = payment;
      payment.capture();
      this.driver?.release(this.to);
    }
    cancel(reason = null) {
      this.#transition(OrderStatus.CANCELLED);
      this.cancelReason = reason;
      this.driver?.release();
    }
    /** @param {import('./Rating.js').Rating} rating */
    rate(rating) {
      if (this.status !== OrderStatus.COMPLETED) throw new Error("\u041E\u0446\u0456\u043D\u0438\u0442\u0438 \u043C\u043E\u0436\u043D\u0430 \u043B\u0438\u0448\u0435 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0443 \u043F\u043E\u0457\u0437\u0434\u043A\u0443");
      this.rating = rating;
    }
    // ---------- Чат ----------
    addMessage(author, text) {
      const msg = new ChatMessage(author, text);
      this.messages.push(msg);
      return msg;
    }
    // ---------- Допоміжне ----------
    get statusLabel() {
      return STATUS_LABELS[this.status];
    }
    get isActive() {
      return [OrderStatus.SEARCHING, OrderStatus.DRIVER_ASSIGNED, OrderStatus.DRIVER_ARRIVED, OrderStatus.IN_PROGRESS].includes(this.status);
    }
    get total() {
      return (this.price ?? 0) + (this.payment?.tip ?? 0);
    }
    #assertDraft() {
      if (this.status !== OrderStatus.DRAFT) throw new Error("\u0417\u043C\u0456\u043D\u044E\u0432\u0430\u0442\u0438 \u043C\u043E\u0436\u043D\u0430 \u043B\u0438\u0448\u0435 \u0447\u0435\u0440\u043D\u0435\u0442\u043A\u0443 \u0437\u0430\u043C\u043E\u0432\u043B\u0435\u043D\u043D\u044F");
    }
    #transition(next) {
      if (!canTransition(this.status, next)) {
        throw new Error(`\u041D\u0435\u0434\u043E\u043F\u0443\u0441\u0442\u0438\u043C\u0438\u0439 \u043F\u0435\u0440\u0435\u0445\u0456\u0434: ${STATUS_LABELS[this.status]} \u2192 ${STATUS_LABELS[next]}`);
      }
      this.status = next;
      this.log.push({ status: next, at: Date.now() });
    }
  };

export { nextId, Order };
