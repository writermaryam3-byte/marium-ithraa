export const formatCurrency = (number: number) => {
  const currencyFormatter = Intl.NumberFormat("ar-sa", {
    currency: "",
    style: "currency",
    numberingSystem: "latn"
  });
  return currencyFormatter.format(number);
};
