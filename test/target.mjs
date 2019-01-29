export function doSomething() {
  return 3;
}

export function exception() {
  throw new Error("hogehoge");
}

export default { doSomething, exception }