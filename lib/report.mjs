const red = '\u001b[31m';
const green = '\u001b[32m';
const reset = '\u001b[0m';
const white = '\u001b[37m';

const check = "\u2714";
const cross = "\u274C";

function coloredText(text, c = white) {
  return c + text + reset;
}

export function indent(level = 0) {
  return (new Array(level + 1)).join("  ");
}

export class Stats {
  constructor(result) {
    this.failed = result.failures.length;
    this.total = result.done.length;

    for (const r of result.children) {
      const s = new Stats(r);
      this.failed += s.failed;
      this.total += s.total;
    }
  }
  get passed() {
    return this.total - this.failed;
  }
  get coverage() {
    const actual = this.passed / this.total;
    return Math.floor(actual * 10000) / 100;
  }
  toString() {
    return `Total ${this.total} / ${this.passed} passed / ${this.failed} failed / ${this.coverage}% coverage`;
  }
}

function passed(text) {
  return coloredText(`${check}  ${text}`, green);
}

function failure(text) {
  return coloredText(`${cross} ${text}`, red);
}

class SessionReport {
  constructor(result) {
    this.result = result;
    this.children = result.children.map(i => new SessionReport(i));
    this.trials = result.done.map(i => new TrialReport(i));
  }
  toString(level = 0) {
    const r = this.result;
    const space = indent(level);
    const children = this.children.map(i => i.toString(level + 1));
    const trials = this.trials.map(i => i.toString(level + 1));
    const text = `${space}${r.description}\n${trials.join("\n")}\n${children.join("\n")}`;
    return text;
  }
}

class TrialReport {
  constructor(trial) {
    this.trial = trial;
  }
  get heading() {
    const decorator = this.trial.failed ? failure : passed;
    return decorator("it " + this.trial.description);
  }
  get reason() {
    return this.trial.failed ? `: ${this.trial.error}` : ""
  }
  toString(level = 0) {
    const space = indent(level);
    const text = `${space}${this.heading}${this.reason}`;
    return text;
  }
}

export class Report {
  constructor(result) {
    this.stats = new Stats(result);
    this.reporter = new SessionReport(result);
  }
  toString() {
    const stats = this.stats.toString();
    const report = this.reporter.toString(-1);
    const text = `${stats}${report}`;
    return text;
  }
}

export default { Stats, Report };