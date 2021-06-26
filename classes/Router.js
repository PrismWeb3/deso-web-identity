import { delay } from "../deps/deno/async/delay.js";

class Router {
  identity = null;
  queue = [];
  busy = false;
  constructor(identity) {
    this.identity = identity;
  }

  async submit(route, payload) {
    return new Promise(async (resolve, reject) => {
      this.__push({
        route,
        payload,
        resolve,
        reject,
      });
      /*       let response = await this.post(route, payload)
      if (response.ok) {
        response = await response.json();
        this.identity.signAndSend(response, resolve, reject)
      } */
    });
  }

  __push(payload) {
    if (!this.identity.signingReady || this.busy) {
      this.queue.push(payload);
    } else {
      this.execute(payload);
    }
  }
  async next() {
    if (this.queue.length === 0) return Promise.resolve();
    return this.execute(this.queue.shift());
  }

  async execute(item) {
    if (!this.identity.signingReady || this.busy) {
      this.queue.unshift(item);
      return null;
    }
    const { route, payload, resolve, reject } = item;
    this.busy = true;
    let response = await this.post(route, payload);
    if (response.ok) {
      response = await response.json();
      this.identity.signTransaction(response, resolve, reject);
    } else if (response.status === 400) {
      reject(this.identity.errorMessage("BadRequest"));
    }
    switch (response.status) {
      case 400: {
        reject(this.identity.errorMessage("BadRequest"));
        break;
      }
      case 429: {
        this.queue.unshift(item);
        // waits two seconds before sending more requests
        await delay(2000);
      }
    }
    this.busy = false;
    return this.next();
  }

  async post(route, payload) {
    let response = await fetch(
      `${this.identity.config.requestRoute}/api/v0/${route}`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );
    return response;
  }
  /*     let response = await fetch(`${this.config.requestRoute}/api/v0/${route}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    response = await response.json();
    return response; */
  get() {
  }
}
export { Router };
