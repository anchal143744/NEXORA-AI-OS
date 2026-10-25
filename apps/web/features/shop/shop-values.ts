/** Quantities have at most four decimal places in the persisted retail schema. */
export function quantityAtOrBelow(value: string, threshold: string) {
  const scaled = (input: string) => {
    if (!/^\d+(\.\d{1,4})?$/.test(input)) throw new Error('Invalid stock quantity');
    const [whole, fraction = ''] = input.split('.');
    return BigInt(whole) * 10000n + BigInt(fraction.padEnd(4, '0'));
  };
  return scaled(value) <= scaled(threshold);
}

/** Keep negative numeric amounts numeric; neutralize formulas in editable labels. */
export function reportCsv(rows: readonly (readonly string[])[]) {
  return rows.map(row => row.map(cell => {
    const numeric = /^-?\d+(\.\d+)?$/.test(cell);
    const safe = !numeric && /^[\s]*[=+@\-\t\r]/.test(cell) ? "'" + cell : cell;
    return '"' + safe.replaceAll('"', '""') + '"';
  }).join(',')).join('\r\n');
}
