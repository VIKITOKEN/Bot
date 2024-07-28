
export const numberFormat =  (integer) => new Intl.NumberFormat("en-GB", {
   notation: "compact",compactDisplay: "short",
   minimumFractionDigits: 0, maximumFractionDigits: 2
}).format(+integer)

