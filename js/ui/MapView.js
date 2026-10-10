import { S } from "../models/OrderStatus.js";
import { SeededRandom } from "../core/SeededRandom.js";

  var MapView = class _MapView {
    /**
     * @param {SVGSVGElement} svg
     * @param {HTMLElement} container елемент, розміри якого задають видиму область
     * @param {import('../services/CityMap.js').CityMap} cityMap
     */
    constructor(svg2, container, cityMap) {
      this.svg = svg2;
      this.container = container;
      this.cityMap = cityMap;
      this.view = { cx: 420, cy: 1180, s: 0.75 };
      this.size = { w: 390, h: 800 };
      this.insets = { top: 98, bottom: 0 };
      this.overlay = {};
      this.traffic = [];
      this.anim = null;
      this.reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    // ---------- Побудова карти ----------
    build() {
      const g = this.cityMap.grid;
      const hw = (v) => g.mainX.includes(v) || g.mainY.includes(v) ? 15 : 10;
      const rng = new SeededRandom(7);
      const xb = [-400, ...g.xs, g.width + 400];
      const yb = [-400, ...g.ys, g.height + 400];
      let s = `<rect x="-400" y="-400" width="${g.width + 800}" height="${g.height + 800}" fill="var(--map-bg)"/>`;
      for (let i = 0; i < xb.length - 1; i++) {
        for (let j = 0; j < yb.length - 1; j++) {
          const x0 = xb[i] + (i ? hw(xb[i]) : 0) + 7, x1 = xb[i + 1] - (i < xb.length - 2 ? hw(xb[i + 1]) : 0) - 7;
          const y0 = yb[j] + (j ? hw(yb[j]) : 0) + 7, y1 = yb[j + 1] - (j < yb.length - 2 ? hw(yb[j + 1]) : 0) - 7;
          const park = g.parks.includes(`${i},${j}`);
          s += `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" rx="10" fill="var(${park ? "--map-park" : "--map-block"})"/>`;
          s += park ? this.#parkTrees(x0, y0, x1, y1, rng) : this.#buildings(x0, y0, x1, y1, rng);
        }
      }
      s += '<path d="M -400 1000 C 120 860, 300 1020, 520 935 S 900 830, 1520 905" fill="none" stroke="var(--map-water)" stroke-width="44" stroke-linecap="round"/>';
      s += '<text x="210" y="955" fill="var(--map-label)" font-size="15" font-style="italic" transform="rotate(-8 210 955)">\u0440. \u041B\u043E\u043F\u0430\u043D\u044C</text>';
      const line = (x1, y1, x2, y2, w, c) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(${c})" stroke-width="${w}" stroke-linecap="round"/>`;
      for (const pass of ["casing", "fill"]) {
        for (const x of g.xs) s += line(x, -400, x, g.height + 400, hw(x) * 2 + (pass === "casing" ? 3 : 0), pass === "casing" ? "--map-casing" : g.mainX.includes(x) ? "--map-main" : "--map-street");
        for (const y of g.ys) s += line(-400, y, g.width + 400, y, hw(y) * 2 + (pass === "casing" ? 3 : 0), pass === "casing" ? "--map-casing" : g.mainY.includes(y) ? "--map-main" : "--map-street");
      }
      const label = (x, y, t, vertical) => `<text x="${x}" y="${y}" fill="var(--map-label)" font-weight="600" text-anchor="middle" dominant-baseline="central" letter-spacing=".3"${vertical ? ` transform="rotate(-90 ${x} ${y})"` : ""}>${t}</text>`;
      s += '<g id="map-labels" font-size="12.5">';
      const vPos = [[265, 1165], [720, 1395], [490, 1395], [720, 1165], [490, 1395]];
      g.xs.forEach((x, i) => vPos[i].forEach((y) => {
        s += label(x, y, g.vertical[x], true);
      }));
      const hPos = [225, 445, 890, 670, 225, 670, 890];
      g.ys.forEach((y, i) => {
        s += label(hPos[i], y, g.horizontal[y], false);
      });
      s += '</g><g id="map-traffic"></g><g id="map-overlay"></g>';
      this.svg.innerHTML = s;
      this.labelsLayer = this.svg.querySelector("#map-labels");
      this.trafficLayer = this.svg.querySelector("#map-traffic");
      this.overlayLayer = this.svg.querySelector("#map-overlay");
      this.measure();
      this.apply();
    }
    #buildings(x0, y0, x1, y1, rng) {
      let s = "";
      const cols = Math.max(1, Math.floor((x1 - x0) / 70)), rows = Math.max(1, Math.floor((y1 - y0) / 70));
      const cw = (x1 - x0 - 12) / cols, rh = (y1 - y0 - 12) / rows;
      for (let c = 0; c < cols; c++) {
        for (let k = 0; k < rows; k++) {
          if (rng.next() < 0.25) continue;
          const bw = cw * (0.55 + rng.next() * 0.35), bh = rh * (0.55 + rng.next() * 0.35);
          s += `<rect x="${(x0 + 6 + c * cw + (cw - bw) / 2).toFixed(1)}" y="${(y0 + 6 + k * rh + (rh - bh) / 2).toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" rx="3" fill="var(--map-bldg)"/>`;
        }
      }
      return s;
    }
    #parkTrees(x0, y0, x1, y1, rng) {
      let s = "";
      for (let q = 0; q < 6; q++) {
        const cx = x0 + 20 + rng.next() * (x1 - x0 - 40), cy = y0 + 20 + rng.next() * (y1 - y0 - 40);
        s += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${(7 + rng.next() * 7).toFixed(1)}" fill="var(--map-bg)" opacity=".35"/>`;
      }
      return s;
    }
    // ---------- Камера ----------
    measure() {
      const r = this.container.getBoundingClientRect();
      this.size = { w: r.width, h: r.height };
    }
    setInsets(top, bottom) {
      this.insets = { top, bottom };
    }
    apply() {
      const { cx, cy, s } = this.view, { w, h } = this.size;
      this.svg.setAttribute("viewBox", `${(cx - w / 2 / s).toFixed(2)} ${(cy - h / 2 / s).toFixed(2)} ${(w / s).toFixed(2)} ${(h / s).toFixed(2)}`);
      this.labelsLayer?.setAttribute("font-size", Math.min(18, Math.max(10, 10.5 / s)).toFixed(1));
      this.drawOverlay();
    }
    /** Плавний перехід камери. */
    animateTo(target, ms = 450) {
      cancelAnimationFrame(this.anim);
      const from = { ...this.view }, t0 = performance.now();
      const duration = this.reduceMotion ? 0 : ms;
      const step = (now) => {
        const k = duration ? Math.min(1, (now - t0) / duration) : 1;
        const e = 1 - Math.pow(1 - k, 3);
        this.view = { cx: from.cx + (target.cx - from.cx) * e, cy: from.cy + (target.cy - from.cy) * e, s: from.s + (target.s - from.s) * e };
        this.apply();
        if (k < 1) this.anim = requestAnimationFrame(step);
      };
      this.anim = requestAnimationFrame(step);
    }
    /** Екранна Y-координата центру вільної від інтерфейсу області. */
    visibleCenterY() {
      const { top, bottom } = this.insets;
      return top + (this.size.h - top - bottom) / 2;
    }
    /** Вмістити набір точок у видиму область. */
    fit(points, maxScale = 1.25) {
      const xs = points.map((p) => p[0]), ys = points.map((p) => p[1]);
      const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
      const { top, bottom } = this.insets, side = 44;
      const availW = this.size.w - 2 * side;
      const availH = Math.max(120, this.size.h - top - bottom - 46);
      const s = Math.min(maxScale, availW / Math.max(60, x1 - x0), availH / Math.max(60, y1 - y0));
      this.animateTo({ cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 - (this.visibleCenterY() - this.size.h / 2) / s, s });
    }
    /** Відцентрувати карту на точці у видимій області. */
    centerOn(x, y, scale = this.view.s) {
      this.animateTo({ cx: x, cy: y - (this.visibleCenterY() - this.size.h / 2) / scale, s: scale });
    }
    /** Координати карти під заданою екранною точкою. */
    mapPointAt(px, py) {
      const { cx, cy, s } = this.view;
      return { x: cx + (px - this.size.w / 2) / s, y: cy + (py - this.size.h / 2) / s };
    }
    /** Точка карти під центром видимої області (для вибору адреси шпилькою). */
    centerPoint() {
      return this.mapPointAt(this.size.w / 2, this.visibleCenterY());
    }
    /** Пряме маніпулювання: перетягування та масштабування коліщатком. */
    enableInteraction({ onMove, onEnd } = {}) {
      let drag = null;
      const g = this.cityMap.grid;
      this.svg.addEventListener("pointerdown", (e) => {
        drag = { x: e.clientX, y: e.clientY, cx: this.view.cx, cy: this.view.cy, moved: false };
        this.svg.setPointerCapture(e.pointerId);
        this.svg.classList.add("dragging");
        cancelAnimationFrame(this.anim);
      });
      this.svg.addEventListener("pointermove", (e) => {
        if (!drag) return;
        const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
        if (Math.abs(dx) + Math.abs(dy) > 3) drag.moved = true;
        this.view.cx = Math.max(-100, Math.min(g.width + 100, drag.cx - dx / this.view.s));
        this.view.cy = Math.max(-100, Math.min(g.height + 100, drag.cy - dy / this.view.s));
        this.apply();
        onMove?.();
      });
      const end = () => {
        if (!drag) return;
        this.svg.classList.remove("dragging");
        const moved = drag.moved;
        drag = null;
        if (moved) onEnd?.();
      };
      this.svg.addEventListener("pointerup", end);
      this.svg.addEventListener("pointercancel", end);
      this.svg.addEventListener("wheel", (e) => {
        e.preventDefault();
        this.view.s = Math.max(0.45, Math.min(2.2, this.view.s * (e.deltaY < 0 ? 1.12 : 1 / 1.12)));
        this.apply();
        onEnd?.();
      }, { passive: false });
    }
    // ---------- Накладення ----------
    /**
     * @param {object} o
     * @param {import('../models/Route.js').Route} [o.route]     маршрут поїздки
     * @param {import('../models/Route.js').Route} [o.approach]  маршрут водія (пунктир)
     * @param {{x:number,y:number}} [o.from]  точка подачі
     * @param {{x:number,y:number}} [o.to]    пункт призначення
     * @param {{x:number,y:number,angle:number}} [o.car] авто водія
     * @param {'pulse'|'halo'} [o.fromEffect]
     */
    setOverlay(o) {
      this.overlay = o;
      this.drawOverlay();
    }
    drawOverlay() {
      if (!this.overlayLayer) return;
      const o = this.overlay, k = 1 / this.view.s;
      let s = "";
      if (o.route) {
        const pts = o.route.toSvgPoints();
        s += `<polyline points="${pts}" fill="none" stroke="var(--surface)" stroke-width="${12 * k}" stroke-linejoin="round" stroke-linecap="round"/>`;
        s += `<polyline points="${pts}" fill="none" stroke="var(--route)" stroke-width="${6.5 * k}" stroke-linejoin="round" stroke-linecap="round"/>`;
      }
      if (o.approach) {
        s += `<polyline points="${o.approach.toSvgPoints()}" fill="none" stroke="var(--route)" stroke-width="${4 * k}" stroke-dasharray="${8 * k} ${8 * k}" stroke-linecap="round" opacity=".7"/>`;
      }
      if (o.from) {
        const { x, y } = o.from;
        if (o.fromEffect === "pulse") s += `<circle cx="${x}" cy="${y}" r="${40 * k}" fill="var(--route)" opacity=".18"><animate attributeName="r" values="${12 * k};${90 * k}" dur="1.6s" repeatCount="indefinite"/><animate attributeName="opacity" values=".35;0" dur="1.6s" repeatCount="indefinite"/></circle>`;
        if (o.fromEffect === "halo") s += `<circle cx="${x}" cy="${y}" r="${26 * k}" fill="var(--route)" opacity=".16"/>`;
        s += `<circle cx="${x}" cy="${y}" r="${10 * k}" fill="var(--ink)" stroke="var(--surface)" stroke-width="${4 * k}"/>`;
      }
      if (o.to) {
        s += `<g transform="translate(${o.to.x} ${o.to.y}) scale(${k})"><path d="M0 0 L0 -34" stroke="var(--ink)" stroke-width="3" stroke-linecap="round"/><rect x="0" y="-36" width="22" height="16" rx="3" fill="var(--accent)" stroke="var(--ink)" stroke-width="2.4"/><circle r="4.5" fill="var(--ink)" stroke="var(--surface)" stroke-width="2"/></g>`;
      }
      if (o.car) s += _MapView.carSvg(o.car, k * 1.15, true);
      this.overlayLayer.innerHTML = s;
    }
    /** Перемалювати вільні авто. */
    drawTraffic(positions) {
      if (!this.trafficLayer) return;
      const k = 1 / this.view.s * 0.95;
      this.trafficLayer.innerHTML = positions.map((p) => _MapView.carSvg(p, k, false)).join("");
    }
    /** Іконка авто (вид згори). */
    static carSvg({ x, y, angle }, scale, mine) {
      return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${angle.toFixed(1)}) scale(${scale.toFixed(3)})"><rect x="-15" y="-8.5" width="30" height="17" rx="5" fill="${mine ? "var(--accent)" : "var(--car)"}" stroke="var(--surface)" stroke-width="2"/><rect x="2" y="-6" width="7" height="12" rx="2" fill="var(--surface)" opacity=".75"/><rect x="-11" y="-6" width="5" height="12" rx="2" fill="var(--surface)" opacity=".5"/></g>`;
    }
  };

export { MapView };
