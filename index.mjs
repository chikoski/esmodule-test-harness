import { Harness } from "./lib/harness.mjs"

const formatter = new Map([
  ["ERR_ASSERTION", error => `assersion error (${error.actual} ${error.operator} ${error.expected})`],
  ["unknown", error => error + ""]
]);

export function describe(description, body) {
  Harness.create().describe(description, body);
}

export function it(description, body) {
  Harness.create().testcase(description, body);
}

export function before(func) {
  Harness.create().before(func);
}

export function after(func) {
  Harness.create().after(func);
}

export function beforeEach(func) {
  Harness.create().beforeEach(func);
}

export function afterEach(func) {
  Harness.create().afterEach(func);
}

global.describe = describe;
global.it = it;
global.before = before;
global.after = after;
global.beforeEach = beforeEach;
global.afterEach = afterEach;
global.Harness = Harness;

export default { describe, it, before, after, beforeEach, afterEach };