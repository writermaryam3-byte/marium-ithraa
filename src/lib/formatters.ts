export const formatCurrency = (number: number, currency: string = 'SAR', locale: string = 'en') => {
  const currencyFormatter = Intl.NumberFormat(locale, {
    currency,
    style: 'currency',
    numberingSystem: 'latn',
  })
  return currencyFormatter.format(number)
}
