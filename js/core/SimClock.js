

  var SimClock = class _SimClock {
    constructor(startMinutes) {
      this.minutes = startMinutes;
    }
    advance(minutes) {
      this.minutes += minutes;
    }
    /** Час через `offset` хвилин у форматі «ГГ:ХХ». */
    format(offset = 0) {
      return _SimClock.hhmm(this.minutes + offset);
    }
    static hhmm(totalMinutes) {
      const m = (Math.round(totalMinutes) % 1440 + 1440) % 1440;
      return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
    }
  };

export { SimClock };
