// Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.
// Modified by Christopher Lamers for use in JS files
/* Resolves after the given number of milliseconds. */
export function delay(ms) {
  return new Promise((res) =>
    setTimeout(() => {
      res();
    }, ms)
  );
}
