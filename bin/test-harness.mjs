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
  import("../index.mjs"),
  import("path")
]).then(([Harness, path]) => {
  function expandPath(fragment) {
    if (fragment.charAt(0) === "/") {
      return path;
    }
    return path.join(process.cwd(), fragment);
  }

  const args = process.argv;
  const entryPoint = args.length > 2 ? args[2] : DEFAULT;
  const runtime = new Runtime(Harness.Harness);
  runtime.start(expandPath(entryPoint));
});
