import { EventEmitter } from "../core/EventEmitter.js";
import { Order } from "../models/Order.js";
import { OrderStatus } from "../models/OrderStatus.js";
import { Payment } from "../models/Payment.js";
import { RideSimulator } from "./RideSimulator.js";

  var OrderService = class extends EventEmitter {
    /**
     * @param {object} deps
     * @param {import('./Catalog.js').Catalog} deps.catalog
     * @param {import('./CityMap.js').CityMap} deps.cityMap
     * @param {import('./PricingService.js').PricingService} deps.pricing
     * @param {import('./DispatchService.js').DispatchService} deps.dispatch
     * @param {RideSimulator} deps.simulator
     * @param {import('./HistoryRepository.js').HistoryRepository} deps.history
     * @param {import('../core/SimClock.js').SimClock} deps.clock
     * @param {typeof import('../config.js').CONFIG} deps.config
     */
    constructor({ catalog, cityMap, pricing, dispatch, simulator, history, clock, config }) {
      super();
      Object.assign(this, { catalog, cityMap, pricing, dispatch, simulator, history, clock, config });
      this.abortSearch = null;
      simulator.on("finish", (e) => this.#onSimulationFinish(e));
    }
    /** Створити чернетку замовлення для маршруту from → to. */
    createDraft(from, to, preset = {}) {
      const passenger = this.catalog.passenger;
      const order = new Order({
        passenger,
        from,
        to,
        route: this.cityMap.buildRoute(from, to),
        tariff: preset.tariff ?? this.catalog.defaultTariff,
        paymentMethod: preset.paymentMethod ?? passenger.defaultPayment
      });
      for (const opt of preset.options ?? []) order.setOption(opt, true, preset.variants?.[opt.id]);
      if (preset.comment) order.comment = preset.comment;
      return order;
    }
    /** Нова чернетка з тими самими параметрами (після скасування). */
    redraft(order) {
      const variants = Object.fromEntries([...order.options.entries()].map(([id, v]) => [id, v.variant]));
      return this.createDraft(order.from, order.to, {
        tariff: order.tariff,
        paymentMethod: order.paymentMethod,
        options: order.selectedOptions,
        variants,
        comment: order.comment
      });
    }
    /** Чернетка з запису історії (кнопка «Повторити»). */
    draftFromHistory(index) {
      const e = this.history.get(index);
      return this.createDraft(this.catalog.place(e.fromId), this.catalog.place(e.toId), {
        tariff: this.catalog.tariff(e.tariffId),
        options: e.optionIds.map((id) => this.catalog.option(id))
      });
    }
    quotes(order) {
      return this.pricing.quoteAll(order);
    }
    quote(order) {
      return this.pricing.quote(order);
    }
    /** Підтвердити замовлення: зафіксувати ціну й почати пошук водія (або запланувати). */
    async place(order) {
      const { price } = this.pricing.quote(order);
      order.place(price);
      if (order.status === OrderStatus.SCHEDULED) {
        this.history.addFromOrder(order, `\u0421\u044C\u043E\u0433\u043E\u0434\u043D\u0456 \u043E ${order.scheduledAt} (\u0437\u0430\u043F\u043B\u0430\u043D\u043E\u0432\u0430\u043D\u043E)`);
        this.emit("scheduled", order);
        return;
      }
      this.emit("searching", order);
      this.abortSearch = new AbortController();
      try {
        const { driver, approach } = await this.dispatch.findDriver(order, this.abortSearch.signal);
        order.assignDriver(driver);
        order.approach = approach;
        const eta = order.tariff.pickupEta(order.selectedOptions);
        order.etaMin = eta;
        this.simulator.start(RideSimulator.Phase.APPROACH, approach, eta * this.config.SIM_MS_PER_MIN, eta);
        order.addMessage("them", `\u0414\u043E\u0431\u0440\u043E\u0433\u043E \u0440\u0430\u043D\u043A\u0443! ${order.hasOption("child") ? "\u041A\u0440\u0456\u0441\u043B\u043E \u0432\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u0435, " : ""}\u043F\u0456\u0434\u2019\u0457\u0436\u0434\u0436\u0430\u044E.`);
        this.emit("driverAssigned", order);
      } catch (err) {
        if (err.name === "AbortError") return;
        order.cancel("\u041D\u0435\u043C\u0430\u0454 \u0432\u043E\u0434\u0456\u0457\u0432");
        this.emit("error", { order, message: err.message });
      } finally {
        this.abortSearch = null;
      }
    }
    /** Скасувати замовлення. Повертає нову чернетку з тими самими параметрами. */
    cancel(order, reason) {
      this.abortSearch?.abort();
      this.simulator.reset();
      order.cancel(reason);
      this.emit("cancelled", order);
      return this.redraft(order);
    }
    /** Пасажир сів в авто — починаємо поїздку. */
    board(order) {
      order.startRide();
      const minutes = this.cityMap.rideMinutes(order.route);
      order.rideMin = minutes;
      const ms = Math.min(this.config.RIDE_MAX_MS, minutes * this.config.SIM_MS_PER_MIN * 0.75);
      this.simulator.start(RideSimulator.Phase.RIDE, order.route, ms, minutes);
      this.emit("rideStarted", order);
    }
    /** Оцінити поїздку та зберегти її в історії. */
    rate(order, rating, tip = 0) {
      order.payment.setTip(tip);
      order.rate(rating);
      this.history.addFromOrder(order, `\u0421\u044C\u043E\u0433\u043E\u0434\u043D\u0456, ${this.clock.format(-(order.rideMin ?? 0))}`);
      this.simulator.reset();
      this.emit("rated", order);
    }
    #onSimulationFinish({ phase, minutes }) {
      const order = this.currentOrder;
      if (!order) return;
      this.clock.advance(minutes);
      if (phase === RideSimulator.Phase.APPROACH) {
        order.markDriverArrived();
        this.emit("driverArrived", order);
      } else {
        order.complete(new Payment({ method: order.paymentMethod, amount: order.price }));
        this.emit("completed", order);
      }
    }
    /** Поточне замовлення встановлює контролер застосунку. */
    setCurrent(order) {
      this.currentOrder = order;
    }
  };

export { OrderService };
