

  var Place = class {
    /**
     * @param {object} p
     * @param {string} p.id
     * @param {string} p.name   назва або адреса
     * @param {string} [p.sub]  уточнення (адреса, місто)
     * @param {number} p.x      координата на карті
     * @param {number} p.y
     * @param {string|null} [p.label]  мітка збереженої адреси: «Дім», «Робота»
     * @param {string} [p.icon]
     */
    constructor({ id, name, sub = "", x, y, label = null, icon = "pin" }) {
      this.id = id;
      this.name = name;
      this.sub = sub;
      this.x = x;
      this.y = y;
      this.label = label;
      this.icon = icon;
    }
    get isSaved() {
      return Boolean(this.label);
    }
    /** Короткий заголовок для списків. */
    get title() {
      return this.label ?? this.name;
    }
    /** Другий рядок у списках. */
    get subtitle() {
      return this.label ? `${this.name} \xB7 ${this.sub}` : this.sub;
    }
    /** Повний опис: «Садочок · Дитячий садок «Сонечко»». */
    get fullTitle() {
      return this.label ? `${this.label} \xB7 ${this.name}` : this.name;
    }
    /** Чи відповідає місце пошуковому запиту (без урахування регістру). */
    matches(query) {
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return `${this.name} ${this.sub} ${this.label ?? ""}`.toLowerCase().includes(q);
    }
    distanceTo(other) {
      return Math.hypot(this.x - other.x, this.y - other.y);
    }
    equals(other) {
      return Boolean(other) && other.id === this.id;
    }
  };

export { Place };
