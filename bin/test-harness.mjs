#!/usr/bin/env node --experimental-modules

import { Runtime } from "../lib/runtime.mjs";
import path from "path";

const DEFAULT = "./test/index.mjs";
function expandPath(fragment) {
  if (fragment.charAt(0) === "/") {
    return path;
  }
  return path.join(process.cwd(), fragment);
}

const args = process.argv;
const entryPoint = args.length > 2 ? args[2] : DEFAULT;
const runtime = new Runtime();
runtime.start(expandPath(entryPoint));