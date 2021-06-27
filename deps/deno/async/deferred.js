/* -> https://deno.land/std@0.99.0/async/deferred.ts */

// Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.
// TODO(ry) It'd be better to make Deferred a class that inherits from
// Promise, rather than an interface. This is possible in ES2016, however
// typescript produces broken code when targeting ES5 code.
// See https://github.com/Microsoft/TypeScript/issues/15202
// At the time of writing, the github issue is closed but the problem remains.
// Modified by Christopher Lamers for use in JS files

export function deferred() {
  let methods;
  const promise = new Promise((resolve, reject) => {
    methods = { resolve, reject };
  });
  return Object.assign(promise, methods);
}
