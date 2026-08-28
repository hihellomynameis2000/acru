export type Money = Readonly<{
  currency: string;
  minorUnits: number;
}>;

export function createMoney(minorUnits: number, currency = "USD"): Money {
  if (!Number.isSafeInteger(minorUnits)) throw new RangeError("Money must use safe integer minor units.");
  if (!/^[A-Z]{3}$/.test(currency)) throw new RangeError("Currency must be a three-letter ISO code.");
  return { currency, minorUnits };
}

export function minorUnitsFromDecimal(value: string, precision = 2) {
  const normalized = value.trim();
  const match = /^(-?)(\d+)(?:\.(\d+))?$/.exec(normalized);
  if (!match) throw new RangeError("Enter a valid decimal amount.");
  const [, sign, whole, fraction = ""] = match;
  if (fraction.length > precision && /[1-9]/.test(fraction.slice(precision))) {
    throw new RangeError(`Amount supports at most ${precision} decimal places.`);
  }
  const factor = 10 ** precision;
  const unsigned = Number(whole) * factor + Number(fraction.slice(0, precision).padEnd(precision, "0"));
  const minorUnits = sign ? -unsigned : unsigned;
  if (!Number.isSafeInteger(minorUnits)) throw new RangeError("Amount is outside the supported range.");
  return minorUnits;
}

export function addMoney(...values: Money[]) {
  if (!values.length) return createMoney(0);
  const currency = values[0].currency;
  if (values.some((value) => value.currency !== currency)) throw new RangeError("Cannot add different currencies.");
  return createMoney(
    values.reduce((total, value) => total + value.minorUnits, 0),
    currency
  );
}

export function formatMoney(value: Money, locale = "en-US") {
  return new Intl.NumberFormat(locale, {
    currency: value.currency,
    style: "currency"
  }).format(value.minorUnits / 100);
}
