class Testcase {
  constructor(description, body) {
    this.mDescription = description;
    this.mBody = body;
  }
  get description() {
    return this.mDescription;
  }
  get body() {
    return this.mBody;
  }
}

class Trial {
  constructor(testCase) {
    this.testCase = testCase;
    this.error = null;
  }
  get description() {
    return this.testCase.description;
  }
  isFailed() {
    return this.error != null;
  }
  run() {
    try {
      this.testCase.body();
    } catch (error) {
      this.error = error;
    }
  }
}

class Stats {
  constructor(result) {
    this.passed = result.passed.length;
    this.failed = result.failed.length;
  }
  get total() {
    return this.passed + this.failed;
  }
  get coverage() {
    const actual = this.passed / this.total;
    return Math.floor(actual * 10000) / 100;
  }
  toString() {
    return `Total ${this.total} / ${this.passed} passed / ${this.failed} failed / ${this.coverage}% coverage`;
  }
}

const formatter = new Map([
  ["ERR_ASSERTION", error => `assersion error (${error.actual} ${error.operator} ${error.expected})`],
  ["unknown", () => "unknown error"]
]);

class Result {
  constructor(session) {
    this.passed = session.done.filter(i => !i.isFailed());
    this.failed = session.failed;
    this.stats = new Stats(this);
  }
  toString() {
    let result = this.stats.toString() + "\n";
    result += this.failed.map(fail => {
      const code = fail.error.code;
      const func = formatter.has(code) ? formatter.get(code) : formatter.get("unknown");
      return `${fail.description} : ${func(fail.error)}`;
    }).join("\n");
    return result;
  }
}

class Session {
  constructor(list) {
    this.all = list;
    this.done = [];
    this.failed = [];
  }
  get finished() {
    return this.all.length === this.done.length;
  }
  get result() {
    if (!this.finished) {
      return null;
    }
    return new Result(this);
  }
  start() {
    this.run();
  }
  run() {
    for (const tc of this.all) {
      const trial = new Trial(tc);
      trial.run();
      if (trial.isFailed()) {
        this.failed.push(trial);
      }
      this.done.push(trial);
    }
  }
}

export class Harness {
  constructor() {
    this.mAll = [];
    this.mResult = null;
  }
  get all() {
    return this.mAll;
  }
  get lastSession() {
    return this.mResult;
  }
  register(description, body) {
    this.mAll.push(new Testcase(description, body));
  }
  start() {
    const session = new Session(this.all);
    this.run(session);
  }
  run(session) {
    if (session == null) {
      this.start();
    }
    session.start();
    this.mResult = session.result;
  }
}

Harness._instance = new Harness();
Harness.create = function () {
  return this._instance;
};

export function describe(description, body) {
  Harness.create().register(description, body);
}

export default { Harness, describe };