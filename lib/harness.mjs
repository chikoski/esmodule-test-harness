import { Session } from "./eval.mjs";
import { indent } from "./report.mjs";

function nop() { }

class Description {
  constructor(description = "") {
    this.description = description;
    this.children = [];
    this.tests = [];
    this.before = nop;
    this.after = nop;
    this.beforeEach = nop;
    this.afterEach = nop;
  }
  add(item) {
    if (item instanceof Description) {
      this.children.push(item);
    } else if (item instanceof Testcase) {
      this.tests.push(item);
    }
  }
  toString(level = 0) {
    const space = indent(level);
    const all = this.tests.concat(this.children);
    return `${space}describe("${this.description}", function(){\n`
      + `${all.map(i => i.toString(level + 1)).join("\n")}\n${space}});`;
  }
}

class Testcase {
  constructor(description, body) {
    this.description = description;
    this.body = body;
    this.befor = nop;
    this.after = nop;
  }
  toString(level = 0) {
    const space = indent(level);
    return `${space}it("${this.description}", function(){});`;
  }
}

export class Harness {
  constructor() {
    this.mStack = [new Description()];
    this.mResult = null;
  }
  get root() {
    return this.mStack[0];
  }
  get all() {
    return this.root.children;
  }
  get top() {
    return this.mStack.length > 0 ? this.mStack[this.mStack.length - 1] : null;
  }
  get lastSession() {
    return this.mResult;
  }
  start() {
    const session = new Session(this.root);
    this.run(session);
  }
  run(session) {
    if (session == null) {
      this.start();
    }
    const result = session.start();
    this.mResult = session.result;
  }
  describe(description, callback) {
    const newDescription = new Description(description);
    this.top.add(newDescription);
    this.mStack.push(newDescription);
    callback();
    this.mStack.pop();
  }
  testcase(description, body) {
    const newTestase = new Testcase(description, body);
    this.top.add(newTestase);
  }
  before(func) {
    if (this.top != null) {
      this.top.before = func;
    }
  }
  beforeEach(func) {
    if (this.top != null) {
      this.top.beforeEach = func;
    }
  }
  after(func) {
    if (this.top != null) {
      this.top.after = func;
    }
  }
  afterEach(func) {
    if (this.top != null) {
      this.top.afterEach = func;
    }
  }
  toString() {
    return this.all.map(i => i.toString()).join("\n\n");
  }
}

const instance = new Harness();
Harness.create = function () {
  return instance;
};

export default { Harness };