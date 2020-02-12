export default class Clock {
  startTime!: number;
  endTime!: number;

  start() {
    this.startTime = Date.now();
  }

  stop() {
    this.endTime = Date.now();
  }

  get duration(): string {
    return ((this.endTime - this.startTime) / 1000).toFixed(2);
  }
}
