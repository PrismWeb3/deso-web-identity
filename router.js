class Router {
  config = null;
  constructor(config) {
    this.config = config;
  }

  post(route, payload){
    let response = await fetch(`${this.config.requestRoute}/api/v0/${route}/`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
    response = await response.json();
    return response;
  }
  get(){

  }
}
export { Router }