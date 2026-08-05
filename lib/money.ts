// Money is always integer minor units + a currency code — never floats,
// never arithmetic on formatted strings. Exponent is per-currency (KWD has 3
// decimal places, not 2 — getting this wrong silently 10x's or 0.1x's prices).

const EXPONENT: Record<string, number> = {
  KWD: 3,
  BHD: 3,
  OMR: 3,
  USD: 2,
  EUR: 2,
  NGN: 2,
  JPY: 0,
};

export type Money = { amount: number; currency: string }; // amount = minor units

export function exponentFor(currency: string): number {
  return EXPONENT[currency] ?? 2;
}

export function format({ amount, currency }: Money, locale = "en"): string {
  const e = exponentFor(currency);
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: e,
    maximumFractionDigits: e,
  }).format(amount / 10 ** e);
}

export function toMinor(major: number, currency: string): number {
  return Math.round(major * 10 ** exponentFor(currency));
}

export function toMajor({ amount, currency }: Money): number {
  return amount / 10 ** exponentFor(currency);
}
