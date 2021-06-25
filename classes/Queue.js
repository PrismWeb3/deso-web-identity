// Registered under MIT
// Developed by Christopher Lamers
class Queue {
  queue = [];
  busy = false;

  constructor() {
  }// pushes new item onto queue

  push(request) {
    if (this.busy) {
      this.queue.push(request);
    } else {
      this.execute(request);
    }
  }

  // acts as a runtime looper
  run() {
    if (this.queue.length === 0) return Promise.resolve();
    return this.execute(this.queue.shift());
  }

  async execute(request) {
    if (this.busy) {
      this.queue.unshift(request);
      return null;
    }
    this.busy = true;

    let response = await request.takeoff();
    if (response.ok) {
      response = await response.json();
      request.resolve(response);
      this.busy = false;

    } else if (response.status === 429) {
      // handle rate limits
      this.queue.unshift(request);
    }
    return this.run();
  }
}

export { Queue };
