import { Report } from "../lib/report.mjs"

export class Runtime {
  constructor(harness) {
    this.harness = harness.create();
  }
  start(entryPoint) {
    import(entryPoint)
      .then(result => this.run())
      .catch(e => this.loadError(e));
  }
  run() {
    this.harness.start();
    const report = new Report(this.harness.lastSession);
    console.log(report + "")
  }
  loadError(e) {
    console.log(e + "");
  }
}

export default { Runtime }