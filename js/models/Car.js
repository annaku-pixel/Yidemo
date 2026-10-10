import { plate } from "../ui/html.js";

  var Car = class {
    constructor({ plate: plate2, model, color, tariffs = [], hasChildSeat = false }) {
      this.plate = plate2;
      this.model = model;
      this.color = color;
      this.tariffs = tariffs;
      this.hasChildSeat = hasChildSeat;
    }
    /** «Сіра Skoda Octavia». */
    get description() {
      return `${this.color[0].toUpperCase()}${this.color.slice(1)} ${this.model}`;
    }
    supportsTariff(tariffId) {
      return this.tariffs.includes(tariffId);
    }
  };

export { Car };
