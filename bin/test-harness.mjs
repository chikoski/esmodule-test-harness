#!/usr/bin/env node --experimental-modules

class Runtime {
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
    console.log(this.harness.lastSession + "")
  }
  loadError(e) {
    console.log(e + "");
  }
}

const DEFAULT = "./test/index.mjs";

Promise.all([
  import("path")
]).then(([path]) => {
  function expandPath(fragment) {
    if (fragment.charAt(0) === "/") {
      return path;
    }
    return path.join(process.cwd(), fragment);
  }
  function main(args) {
    const entryPoint = args.length > 2 ? args[2] : DEFAULT;
    import("../index.mjs")
      .then(mod => new Runtime(mod.Harness))
      .then(runtime => {
        runtime.start(expandPath(entryPoint));
      }).catch(e => console.log(e));
  }
  main(process.argv);
});
