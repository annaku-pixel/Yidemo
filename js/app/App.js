import * as seedData from "../data/seed.js";
import { AmbientTraffic } from "../ui/AmbientTraffic.js";
import { CONFIG } from "../config.js";
import { CallOverlay } from "../ui/CallOverlay.js";
import { CancelModal } from "../ui/modals/CancelModal.js";
import { Catalog } from "../services/Catalog.js";
import { ChatModal } from "../ui/modals/ChatModal.js";
import { CityMap } from "../services/CityMap.js";
import { DispatchService } from "../services/DispatchService.js";
import { DoneScreen } from "../ui/screens/DoneScreen.js";
import { DriverScreen } from "../ui/screens/DriverScreen.js";
import { GRID } from "../data/seed.js";
import { Geocoder } from "../services/Geocoder.js";
import { GuidePanel } from "../ui/GuidePanel.js";
import { HISTORY } from "../data/seed.js";
import { HelpModal } from "../ui/modals/HelpModal.js";
import { HistoryRepository } from "../services/HistoryRepository.js";
import { HistoryScreen } from "../ui/screens/HistoryScreen.js";
import { HomeScreen } from "../ui/screens/HomeScreen.js";
import { Icons } from "../ui/Icons.js";
import { MapView } from "../ui/MapView.js";
import { MenuDrawer } from "../ui/MenuDrawer.js";
import { OptionsModal } from "../ui/modals/OptionsModal.js";
import { OrderService } from "../services/OrderService.js";
import { OrderStatus } from "../models/OrderStatus.js";
import { PaymentModal } from "../ui/modals/PaymentModal.js";
import { PaymentsScreen } from "../ui/screens/PaymentsScreen.js";
import { PickOnMapScreen } from "../ui/screens/PickOnMapScreen.js";
import { PlacesScreen } from "../ui/screens/PlacesScreen.js";
import { PricingService } from "../services/PricingService.js";
import { RideScreen } from "../ui/screens/RideScreen.js";
import { RideSimulator } from "../services/RideSimulator.js";
import { SCENARIO_STEPS } from "../data/seed.js";
import { ScenarioTracker } from "./ScenarioTracker.js";
import { ScheduleModal } from "../ui/modals/ScheduleModal.js";
import { ScheduledScreen } from "../ui/screens/ScheduledScreen.js";
import { SearchScreen } from "../ui/screens/SearchScreen.js";
import { SearchingScreen } from "../ui/screens/SearchingScreen.js";
import { ShareModal } from "../ui/modals/ShareModal.js";
import { SimClock } from "../core/SimClock.js";
import { SosModal } from "../ui/modals/SosModal.js";
import { TariffScreen } from "../ui/screens/TariffScreen.js";
import { Toast } from "../ui/Toast.js";

  var App = class _App {
    static SCREENS = [
      HomeScreen,
      SearchScreen,
      PickOnMapScreen,
      TariffScreen,
      ScheduledScreen,
      SearchingScreen,
      DriverScreen,
      RideScreen,
      DoneScreen,
      HistoryScreen,
      PlacesScreen,
      PaymentsScreen
    ];
    static MODALS = [OptionsModal, PaymentModal, ScheduleModal, CancelModal, ShareModal, ChatModal, SosModal, HelpModal];
    /** Звідки стартують вільні авто на карті. */
    static TRAFFIC_START = [[330, 1180], [560, 1330], [420, 1050], [780, 1280], [200, 1280], [560, 820]];
    /** @param {Document} doc */
    constructor(doc = document) {
      this.doc = doc;
      this.config = CONFIG;
      this.el = {
        app: doc.getElementById("app"),
        overlay: doc.getElementById("overlay"),
        map: doc.getElementById("map"),
        clock: doc.getElementById("clock")
      };
      this.hintsEnabled = true;
      this.timers = [];
      this.screen = null;
      this.modal = null;
      this.screens = new Map(_App.SCREENS.map((S2) => [S2.id, new S2(this)]));
      this.modals = new Map(_App.MODALS.map((M) => [M.id, new M(this)]));
      this.drawer = new MenuDrawer(this);
      this.call = new CallOverlay();
      this.toaster = new Toast(this.el.app);
      this.guide = new GuidePanel(doc.getElementById("steps"), doc.getElementById("hintsToggle"));
      this.scenario = new ScenarioTracker(SCENARIO_STEPS);
      this.cityMap = new CityMap(GRID, CONFIG);
      this.map = new MapView(this.el.map, this.el.app, this.cityMap);
      this.traffic = new AmbientTraffic(this.cityMap, _App.TRAFFIC_START);
      this.#initDomain();
    }
    /** Створити (або перестворити під час скидання) доменні сервіси та стан. */
    #initDomain() {
      this.catalog = new Catalog(seedData);
      this.geocoder = new Geocoder(this.cityMap, this.catalog.places, CONFIG.SNAP_RADIUS);
      this.clock = new SimClock(CONFIG.START_CLOCK_MIN);
      this.history = new HistoryRepository(HISTORY);
      this.simulator = new RideSimulator();
      this.orders = new OrderService({
        catalog: this.catalog,
        cityMap: this.cityMap,
        pricing: new PricingService(this.cityMap, this.catalog.tariffs),
        dispatch: new DispatchService(this.catalog.drivers, this.cityMap, CONFIG.SEARCH_DELAY_MS),
        simulator: this.simulator,
        history: this.history,
        clock: this.clock,
        config: CONFIG
      });
      this.pickup = this.catalog.place("home");
      this.setOrder(null);
      this.#bindDomainEvents();
    }
    #bindDomainEvents() {
      const o = this.orders;
      o.on("searching", () => this.navigate("searching"));
      o.on("scheduled", () => this.navigate("scheduled"));
      o.on("driverAssigned", () => this.navigate("driver"));
      o.on("driverArrived", () => {
        this.navigate("driver");
        this.toast("\u0412\u043E\u0434\u0456\u0439 \u043D\u0430 \u043C\u0456\u0441\u0446\u0456 \u2014 \u043C\u043E\u0436\u043D\u0430 \u0432\u0438\u0445\u043E\u0434\u0438\u0442\u0438");
      });
      o.on("rideStarted", () => this.navigate("ride"));
      o.on("completed", () => {
        this.scenario.complete(4);
        this.navigate("done");
      });
      o.on("error", ({ order, message }) => {
        this.setOrder(this.orders.redraft(order));
        this.scenario.undo(2);
        this.navigate("tariff");
        this.toast(message);
      });
      this.simulator.on("progress", (p) => {
        this.map.overlay.car = p.point;
        this.map.drawOverlay();
        this.screen?.onTick(p);
      });
    }
    /** Запуск: побудова карти, підписка на події DOM, перший екран, цикл анімації. */
    start() {
      this.map.build();
      this.map.enableInteraction({ onMove: () => this.screen.onMapMove(), onEnd: () => this.screen.onMapIdle() });
      this.#bindDom();
      this.navigate("home");
      this.lastFrame = performance.now();
      requestAnimationFrame(this.#loop);
      return this;
    }
    // ---------- Навігація та відображення ----------
    navigate(screenId, params = {}) {
      const next = this.screens.get(screenId);
      if (!next) throw new Error(`\u041D\u0435\u0432\u0456\u0434\u043E\u043C\u0438\u0439 \u0435\u043A\u0440\u0430\u043D: ${screenId}`);
      this.screen?.leave();
      this.modal = null;
      this.drawer.close();
      this.screen = next;
      next.enter(params);
      this.render(true);
    }
    /** Перемалювати інтерфейс поточного екрана. refit — перемістити камеру карти. */
    render(refit = false) {
      const s = this.screen;
      const fab = s.showLocateButton ? `<button class="mapfab" data-act="locate" aria-label="\u041C\u043E\u0454 \u043C\u0456\u0441\u0446\u0435\u0437\u043D\u0430\u0445\u043E\u0434\u0436\u0435\u043D\u043D\u044F">${Icons.locate}</button>` : "";
      this.el.overlay.innerHTML = s.topBar() + fab + s.extraOverlay() + s.render() + (this.modal?.render() ?? "") + this.drawer.render() + this.call.render();
      const sheet = this.el.overlay.querySelector(".sheet");
      const sheetHeight = sheet && !sheet.classList.contains("full") ? sheet.offsetHeight : 0;
      this.el.app.style.setProperty("--fab", `${sheetHeight + 14}px`);
      this.map.setInsets(this.#topInset(), sheetHeight);
      this.map.setOverlay(s.mapOverlay());
      s.mounted(this.el.overlay);
      this.modal?.mounted(this.el.overlay);
      this.guide.render(this.scenario, this.hintsEnabled);
      if (this.el.clock) this.el.clock.textContent = this.clock.format();
      if (refit) s.fitMap(this.map);
    }
    #topInset() {
      return parseFloat(getComputedStyle(this.el.app).getPropertyValue("--top")) + 52;
    }
    openModal(id, params) {
      const modal = this.modals.get(id);
      if (!modal) throw new Error(`\u041D\u0435\u0432\u0456\u0434\u043E\u043C\u0435 \u0432\u0456\u043A\u043D\u043E: ${id}`);
      modal.open(params);
      this.modal = modal;
      this.drawer.close();
      this.render();
    }
    closeModal() {
      this.modal = null;
      this.render();
    }
    toast(message) {
      this.toaster.show(message);
    }
    /** Відкладена дія, яку буде скасовано під час скидання. */
    later(fn, ms) {
      this.timers.push(setTimeout(fn, ms));
    }
    // ---------- Сценарій основного завдання ----------
    setOrder(order) {
      this.order = order;
      this.orders?.setCurrent(order);
    }
    setPickup(place) {
      this.pickup = place;
    }
    /** Крок 1: обрано пункт призначення → чернетка замовлення → екран тарифів. */
    chooseDestination(place) {
      if (place.equals(this.pickup)) {
        this.toast("\u0410\u0434\u0440\u0435\u0441\u0430 \u043F\u0440\u0438\u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F \u0437\u0431\u0456\u0433\u0430\u0454\u0442\u044C\u0441\u044F \u0437 \u0430\u0434\u0440\u0435\u0441\u043E\u044E \u043F\u043E\u0434\u0430\u0447\u0456");
        return;
      }
      const prev = this.order && !this.order.isActive ? this.order : null;
      const variants = prev ? Object.fromEntries([...prev.options.entries()].map(([id, v]) => [id, v.variant])) : {};
      this.setOrder(this.orders.createDraft(this.pickup, place, prev ? { tariff: prev.tariff, paymentMethod: prev.paymentMethod, options: prev.selectedOptions, variants, comment: prev.comment } : {}));
      this.scenario.complete(0);
      this.navigate("tariff");
    }
    setPaymentMethod(id) {
      const passenger = this.catalog.passenger;
      passenger.setDefaultPayment(id);
      this.order?.setPaymentMethod(passenger.paymentById(id));
      this.render();
    }
    /** Кроки 2–3: зафіксувати ціну й оформити замовлення. */
    placeOrder() {
      this.scenario.complete(1);
      this.scenario.complete(2);
      this.orders.place(this.order);
    }
    /** Крок 4 → 5: пасажир сів в авто. */
    board() {
      this.scenario.complete(3);
      this.order.addMessage("me", "\u0421\u0456\u043B\u0438, \u043C\u043E\u0436\u043D\u0430 \u0457\u0445\u0430\u0442\u0438");
      this.orders.board(this.order);
    }
    cancelOrder(reason) {
      const draft = this.orders.cancel(this.order, reason);
      this.scenario.undo(2, 3);
      this.setOrder(draft);
      this.navigate("tariff");
      this.toast("\u0417\u0430\u043C\u043E\u0432\u043B\u0435\u043D\u043D\u044F \u0441\u043A\u0430\u0441\u043E\u0432\u0430\u043D\u043E. \u041F\u043B\u0430\u0442\u0430 \u043D\u0435 \u0441\u0442\u044F\u0433\u0443\u0454\u0442\u044C\u0441\u044F.");
    }
    /** Крок 6: оцінка поїздки, повернення на головний екран. */
    submitRating(rating, tip) {
      this.orders.rate(this.order, rating, tip);
      this.scenario.complete(5);
      this.pickup = this.order.to;
      this.setOrder(null);
      this.navigate("home");
      this.toast("\u0414\u044F\u043A\u0443\u0454\u043C\u043E \u0437\u0430 \u043E\u0446\u0456\u043D\u043A\u0443! \u041F\u043E\u0457\u0437\u0434\u043A\u0443 \u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u043E \u0432 \u0456\u0441\u0442\u043E\u0440\u0456\u0457.");
    }
    repeatFromHistory(index) {
      const draft = this.orders.draftFromHistory(index);
      this.pickup = draft.from;
      this.setOrder(draft);
      this.scenario.complete(0);
      this.navigate("tariff");
      this.toast("\u041C\u0430\u0440\u0448\u0440\u0443\u0442 \u0456 \u043F\u043E\u0431\u0430\u0436\u0430\u043D\u043D\u044F \u043F\u0456\u0434\u0441\u0442\u0430\u0432\u043B\u0435\u043D\u043E \u0437 \u0456\u0441\u0442\u043E\u0440\u0456\u0457");
    }
    goHome() {
      if (this.order && !this.order.isActive && this.order.status !== OrderStatus.DRAFT) this.setOrder(null);
      this.navigate("home");
    }
    /** «Почати спочатку»: скинути всі дані до початкових. */
    reset() {
      this.timers.forEach(clearTimeout);
      this.timers = [];
      this.orders.abortSearch?.abort();
      this.simulator.reset();
      this.call.close();
      this.scenario.reset();
      this.#initDomain();
      this.navigate("home");
    }
    // ---------- Обробка подій ----------
    /** Дію спершу отримує відкрите вікно, далі меню, екран, і лише потім — сам застосунок. */
    #dispatch(action, el) {
      if (this.call.isOpen && action !== "end-call") return;
      if (this.modal?.handle(action, el)) return;
      if (this.drawer.isOpen && this.drawer.handle(action, el)) return;
      if (this.screen.handle(action, el)) return;
      this.#handleGlobal(action, el);
    }
    #handleGlobal(action, el) {
      switch (action) {
        case "drawer":
          this.drawer.open();
          this.render();
          break;
        case "modal":
          this.openModal(el.dataset.id);
          break;
        case "close-modal":
          this.closeModal();
          break;
        case "go-home":
          this.goHome();
          break;
        case "locate":
          this.map.centerOn(this.pickup.x, this.pickup.y);
          break;
        case "call":
          this.call.open(this.order.driver);
          this.render();
          break;
        case "end-call":
          this.call.close();
          this.render();
          break;
        case "toast":
          this.toast(el.dataset.msg);
          break;
        case "toggle-hints":
          this.hintsEnabled = el.checked;
          this.render();
          break;
        case "reset":
          this.reset();
          break;
        default:
          console.warn("\u041D\u0435\u043E\u0431\u0440\u043E\u0431\u043B\u0435\u043D\u0430 \u0434\u0456\u044F:", action);
      }
    }
    #bindDom() {
      const doc = this.doc;
      doc.addEventListener("click", (e) => {
        const el = e.target.closest("[data-act]");
        if (!el || el.matches("input, textarea")) return;
        e.preventDefault();
        this.#dispatch(el.dataset.act, el);
      });
      doc.addEventListener("change", (e) => {
        const el = e.target;
        if (el.id === "hintsToggle") {
          this.hintsEnabled = el.checked;
          this.render();
        } else if (el.matches("input[data-act]")) {
          this.#dispatch(el.dataset.act, el);
        }
      });
      doc.addEventListener("input", (e) => this.screen.onInput(e.target));
      doc.addEventListener("focusin", (e) => this.screen.onFocus(e.target));
      doc.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          if (this.call.isOpen) this.call.close();
          else if (this.modal) this.modal = null;
          else if (this.drawer.isOpen) this.drawer.close();
          else return;
          this.render();
          return;
        }
        this.screen.onKey(e);
      });
      window.addEventListener("resize", () => {
        this.map.measure();
        this.map.apply();
        this.render(true);
      });
    }
    /** Цикл анімації: симуляція руху та вільні авто на карті. */
    #loop = (now) => {
      const dt = Math.min(0.05, (now - this.lastFrame) / 1e3);
      this.lastFrame = now;
      this.simulator.tick(now);
      if (this.screen.showTraffic) {
        if (!this.map.reduceMotion) this.traffic.update(dt);
        this.map.drawTraffic(this.traffic.positions());
      } else {
        this.map.drawTraffic([]);
      }
      requestAnimationFrame(this.#loop);
    };
  };

export { App };
