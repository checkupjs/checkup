export function toPercent(numeratorOrValue: number, denominator?: number): string {
  let value: number =
    typeof denominator === 'number' ? numeratorOrValue / denominator : numeratorOrValue;

  return `${(value * 100).toFixed()}%`;
}
