import { Harness } from "./harness.mjs";

function start() {
  const harness = Harness.create();
  harness.start();
  console.log(harness.lastSession + "")
}

function loadError(e) {
  console.log(e + "");
}

function main(args) {
  const entryPoint = args.length > 2 ? args[2] : "./test/index.mjs";
  import(entryPoint)
    .then(start)
    .catch(loadError);
}

main(process.argv);