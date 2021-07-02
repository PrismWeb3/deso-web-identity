/* -> https://deno.land/std@0.100.0/uuid/v4.ts */

// Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.
// Modified by Christopher Lamers for use in JS files
import { bytesToUuid } from "./_common.js";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Validates the UUID v4.
 * @param id UUID value.
 */
export function validate(id) {
  return UUID_RE.test(id);
}

/** Generates a RFC4122 v4 UUID (pseudo-randomly-based) */
export function generate() {
  const rnds = crypto.getRandomValues(new Uint8Array(16));

  rnds[6] = (rnds[6] & 0x0f) | 0x40; // Version 4
  rnds[8] = (rnds[8] & 0x3f) | 0x80; // Variant 10

  return bytesToUuid(rnds);
}