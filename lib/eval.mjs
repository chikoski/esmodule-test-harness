export class Result {
  constructor(session) {
    this.description = session.description;
    this.done = session.trials;
    this.failures = this.done.filter(i => i.failed);
    this.children = session.children.map(c => new Result(c));
  }
}

export class Trial {
  constructor(testCase) {
    this.testCase = testCase;
    this.error = null;
  }
  get description() {
    return this.testCase.description;
  }
  get failed() {
    return this.error != null;
  }
  run() {
    try {
      this.testCase.before();
      this.testCase.body();
      this.testCase.after();
    } catch (error) {
      this.error = error;
    }
  }
}

function session(description) {
  const product = new Session(description);
  product.start();
  return product;
}

function trial(test, before, after) {
  test.before = before;
  test.after = after;
  const product = new Trial(test);
  product.run();
  return product;
}

export class Session {
  constructor(description) {
    this.result = null;
    this.mDescription = description;
    this.children = null;
    this.trials = null;
  }
  get description() {
    return this.mDescription.description;
  }
  start() {
    const description = this.mDescription;
    description.before();
    this.trials = description.tests.map(test => trial(test, description.beforeEach, description.afterEach));
    this.children = description.children.map(session);
    description.after();
    this.result = new Result(this);
    return this.result;
  }
}

export default { Session };