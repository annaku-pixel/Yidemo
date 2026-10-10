import { PASSENGER } from "../data/seed.js";

  var ChatMessage = class _ChatMessage {
    static Author = Object.freeze({ PASSENGER: "me", DRIVER: "them" });
    constructor(author, text, at = Date.now()) {
      this.author = author;
      this.text = text;
      this.at = at;
    }
    get isMine() {
      return this.author === _ChatMessage.Author.PASSENGER;
    }
  };

export { ChatMessage };
