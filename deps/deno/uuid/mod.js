/* -> https://deno.land/std@0.100.0/uuid/mod.ts */

// Supporting Support for RFC4122 version 1, 4, and 5 UUIDs
// Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.
// Modified by Christopher Lamers for use in JS files
import * as v4 from "./v4.js";

export const NIL_UUID = "00000000-0000-0000-0000-000000000000";

/**
 * Checks if UUID is nil
 * @param val UUID value
 */
 export function isNil(val) {
  return val === NIL_UUID;
}

export { v4 };