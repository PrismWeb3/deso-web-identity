class Request {
  route = null;
  method = null;
  body = null;
  resolve = null;
  reject = null;
  constructor(route, method, body, resolve, reject) {
    this.route = route;
    this.method = method;
    this.body = body;
    this.resolve = resolve;
    this.reject = reject;
  }

  async takeoff() {
    const response = await fetch(this.route, {
      method: this.method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.body),
    });
    return response;
  }
}
export { Request };
