class Router {
  identity = null;
  constructor(identity) {
    this.identity = identity;
  }

  async submit(route, payload) {
    return new Promise(async (resolve, reject) => {
      let response = await this.post(route, payload)
      if (response.ok) {
        response = await response.json();
        this.identity.signAndSend(response, resolve, reject)
      }
    });
  }

  async post(route, payload) {
    let response = await fetch(`${this.identity.config.requestRoute}/api/v0/${route}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
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
