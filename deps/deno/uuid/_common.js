/* -> https://deno.land/std@0.100.0/uuid/_common.ts */

// Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.
// Modified by Christopher Lamers for use in JS files
/**
 * Converts the byte array to a UUID string
 * @param bytes Used to convert Byte to Hex
 */
 export function bytesToUuid(bytes) {
  const bits = [...bytes].map((bit) => {
    const s = bit.toString(16);
    return bit < 0x10 ? "0" + s : s;
  });
  return [
    ...bits.slice(0, 4),
    "-",
    ...bits.slice(4, 6),
    "-",
    ...bits.slice(6, 8),
    "-",
    ...bits.slice(8, 10),
    "-",
    ...bits.slice(10, 16),
  ].join("");
}

/**
 * Converts a string to a byte array by converting the hex value to a number.
 * @param uuid Value that gets converted.
 */
export function uuidToBytes(uuid) {
  const bytes = [];

  uuid.replace(/[a-fA-F0-9]{2}/g, (hex) => {
    bytes.push(parseInt(hex, 16));
    return "";
  });

  return bytes;
}

/**
 * Converts a string to a byte array using the char code.
 * @param str Value that gets converted.
 */
export function stringToBytes(str) {
  str = unescape(encodeURIComponent(str));
  const bytes = new Array(str.length);
  for (let i = 0; i < str.length; i++) {
    bytes[i] = str.charCodeAt(i);
  }
  return bytes;
}

/**
 * Creates a buffer for creating a SHA-1 hash.
 * @param content Buffer for SHA-1 hash.
 */
export function createBuffer(content) {
  const arrayBuffer = new ArrayBuffer(content.length);
  const uint8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < content.length; i++) {
    uint8Array[i] = content[i];
  }
  return arrayBuffer;
}