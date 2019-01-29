import { } from "../index.mjs";
import assert from "assert";

import { doSomething, exception } from "./target.mjs"

describe("Arithmetic operation", function () {
  it("should equal to 2", function () {
    const expected = 2;
    assert.equal(1 + 1, expected);
  });
});

describe("target.mjs", function () {
  describe("doSomething()", function () {
    before(function () {
      console.log("before handler");
    });
    const expected = 2;
    it("should return 2", function () {
      assert.equal(doSomething(), expected);
    });
  });

  describe("exception()", function () {
    it("always throws an error", function () {
      assert.equal(exception(), null);
    });
  });

  describe("false", function () {
    it("is always evaluated as false", function () {
      assert.equal(false, false);
    });
  });
});

console.log(import.meta.url);
export default {}