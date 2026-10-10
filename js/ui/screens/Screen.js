import { HINTS } from "../../data/seed.js";
import { Icons } from "../Icons.js";
import { esc } from "../html.js";

  var Screen = class {
    /** Унікальний ідентифікатор екрана (для навігації). */
    static id = "screen";
    /** @param {import('../../app/App.js').App} app */
    constructor(app2) {
      this.app = app2;
    }
    get id() {
      return this.constructor.id;
    }
    /** Панель на весь екран (перекриває карту). */
    get isFullSheet() {
      return false;
    }
    /** Показувати вільні авто на карті. */
    get showTraffic() {
      return true;
    }
    /** Показувати кнопку «Моє місцезнаходження». */
    get showLocateButton() {
      return false;
    }
    /** Ключ контекстної підказки. */
    get hintKey() {
      return this.id;
    }
    // ---------- Життєвий цикл ----------
    /** Викликається під час переходу на екран. */
    enter(_params) {
    }
    /** Викликається під час виходу з екрана. */
    leave() {
    }
    /** Викликається після вставки розмітки в DOM. */
    mounted(_root) {
    }
    // ---------- Відображення ----------
    /** Верхня панель кнопок поверх карти. */
    topBar() {
      return this.bar(this.menuButton(), this.helpButton());
    }
    /** Вміст нижньої панелі (перевизначається в підкласах). */
    content() {
      return "";
    }
    /** Повна розмітка нижньої панелі. */
    render() {
      const body = this.content();
      if (!body) return "";
      return `<div class="sheet${this.isFullSheet ? " full" : ""}">${this.isFullSheet ? "" : '<div class="grab"></div>'}${body}</div>`;
    }
    /** Додаткові елементи поверх карти (наприклад, шпилька в центрі). */
    extraOverlay() {
      return "";
    }
    /** Що показати на карті: маршрут, шпильки, авто. */
    mapOverlay() {
      return {};
    }
    /** Положення камери карти. @param {import('../MapView.js').MapView} _map */
    fitMap(_map) {
    }
    // ---------- Події ----------
    /** Обробити дію (атрибут data-act). Повертає true, якщо дію оброблено. */
    handle(_action, _el) {
      return false;
    }
    onInput(_el) {
    }
    onFocus(_el) {
    }
    onKey(_event) {
    }
    /** Кадр симуляції руху авто. */
    onTick(_progress) {
    }
    /** Карту рухають / карту відпустили. */
    onMapMove() {
    }
    onMapIdle() {
    }
    // ---------- Допоміжні елементи ----------
    hint(key = this.hintKey) {
      const text = HINTS[key];
      if (!this.app.hintsEnabled || !text) return "";
      return `<div class="hint" role="note"><i>i</i><span>${text}</span></div>`;
    }
    bar(left, right) {
      return `<div class="topbar">${left}${right}</div>`;
    }
    menuButton() {
      return `<button class="roundbtn" data-act="drawer" aria-label="\u041C\u0435\u043D\u044E">${Icons.menu}</button>`;
    }
    helpButton() {
      return `<button class="roundbtn" data-act="modal" data-id="help" aria-label="\u042F\u043A \u0437\u0430\u043C\u043E\u0432\u0438\u0442\u0438 \u0442\u0430\u043A\u0441\u0456">${Icons.help}</button>`;
    }
    backButton(action, extra = "") {
      return `<button class="roundbtn" data-act="${action}" ${extra} aria-label="\u041D\u0430\u0437\u0430\u0434">${Icons.back}</button>`;
    }
    /** Заголовок повноекранної панелі з кнопкою «Назад». */
    header(title, backAction = "go-home") {
      return `<div class="row"><button class="roundbtn flat" data-act="${backAction}" aria-label="\u041D\u0430\u0437\u0430\u0434">${Icons.back}</button><h2>${title}</h2></div>`;
    }
    placeIcon(place) {
      return `<span class="ico">${Icons.byName(place.icon)}</span>`;
    }
    placeItem(place, action) {
      return `<button class="item" data-act="${action}" data-id="${place.id}">${this.placeIcon(place)}<div class="grow"><b class="ellipsis">${esc(place.title)}</b><span class="ellipsis">${esc(place.subtitle)}</span></div><span></span></button>`;
    }
  };

export { Screen };
