/** All money is integer cents (SGD). Never use floats for money. */
export type Cents = number;

const sgd = new Intl.NumberFormat("en-SG", {
  style: "currency",
  currency: "SGD",
  currencyDisplay: "narrowSymbol",
  minimumFractionDigits: 2,
});

/** 8500 → "S$85.00" */
export function formatPrice(cents: Cents): string {
  return "S" + sgd.format(cents / 100);
}

/** Drops ".00" for whole-dollar prices on cards: 8500 → "S$85" */
export function formatPriceShort(cents: Cents): string {
  return cents % 100 === 0 ? `S$${(cents / 100).toLocaleString("en-SG")}` : formatPrice(cents);
}
