

  var Rating = class _Rating {
    static GOOD_TAGS = ["\u0412\u0432\u0456\u0447\u043B\u0438\u0432\u0438\u0439 \u0432\u043E\u0434\u0456\u0439", "\u0427\u0438\u0441\u0442\u0438\u0439 \u0441\u0430\u043B\u043E\u043D", "\u041A\u0440\u0456\u0441\u043B\u043E \u0432\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u0435", "\u041F\u043B\u0430\u0432\u043D\u0430 \u0457\u0437\u0434\u0430", "\u0412\u0447\u0430\u0441\u043D\u0430 \u043F\u043E\u0434\u0430\u0447\u0430"];
    static BAD_TAGS = ["\u0417\u0430\u043F\u0456\u0437\u043D\u0435\u043D\u043D\u044F", "\u0411\u0440\u0443\u0434\u043D\u0438\u0439 \u0441\u0430\u043B\u043E\u043D", "\u0420\u0456\u0437\u043A\u0435 \u0432\u043E\u0434\u0456\u043D\u043D\u044F", "\u041D\u0435 \u0431\u0443\u043B\u043E \u043A\u0440\u0456\u0441\u043B\u0430", "\u0406\u043D\u0448\u0438\u0439 \u043C\u0430\u0440\u0448\u0440\u0443\u0442"];
    constructor(stars, tags = [], comment = "") {
      if (!Number.isInteger(stars) || stars < 1 || stars > 5) throw new Error("\u041E\u0446\u0456\u043D\u043A\u0430 \u043C\u0430\u0454 \u0431\u0443\u0442\u0438 \u0432\u0456\u0434 1 \u0434\u043E 5");
      this.stars = stars;
      this.tags = tags;
      this.comment = comment;
    }
    get isPositive() {
      return this.stars >= 4;
    }
    /** Теги, які доречно запропонувати для такої кількості зірок. */
    static tagsFor(stars) {
      if (!stars) return [];
      return stars >= 4 ? _Rating.GOOD_TAGS : _Rating.BAD_TAGS;
    }
  };

export { Rating };
