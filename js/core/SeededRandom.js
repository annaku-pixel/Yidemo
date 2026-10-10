

  var SeededRandom = class {
    constructor(seed = 1) {
      this.state = seed % 2147483647 || 1;
    }
    /** Число в діапазоні [0; 1). */
    next() {
      this.state = this.state * 16807 % 2147483647;
      return (this.state - 1) / 2147483646;
    }
    pick(array) {
      return array[Math.floor(this.next() * array.length)];
    }
  };

export { SeededRandom };
