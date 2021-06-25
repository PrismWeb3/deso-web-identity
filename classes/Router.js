import { Queue } from "./Queue.js";
import { Request } from "./Request.js";

class Router {
  config = null;
  constructor(config) {
    this.config = config;
    this.queue = new Map();
  }

  async post(route, payload) {
    return new Promise((resolve, reject) => {
      if (!this.queue.has(route)) {
        this.queue.set(route, new Queue());
      }
      this.queue.get(route).push(
        new Request(
          `${this.config.requestRoute}/api/v0/${route}`,
          "POST",
          payload,
          resolve,
          reject,
        ),
      );
    });
    /*     let response = await fetch(`${this.config.requestRoute}/api/v0/${route}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    response = await response.json();
    return response; */
  }
  get() {
  }
}
export { Router };
