const stringify = require('json-stable-stringify');

export function stableJson(json: object) {
  return stringify(json, { space: 2 });
}
