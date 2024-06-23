export function extractInfo(p: any) {
  const { items } = p
  const [sku] = items
  const [seller] = sku.sellers
  const { images } = sku

  return { items, sku, seller, images }
}

export function getQuantity(items: Array<any>) {
  return items.reduce(
    (acc: number, curr: any) =>
      acc + curr.sellers[0].commertialOffer.AvailableQuantity,
    0
  )
}

export function getInstallments(seller: any) {
  return (
    seller.commertialOffer.IsAvailable &&
    seller.commertialOffer.Installments.reduce((acc: any, curr: any) => {
      if (curr.InterestRate > 0) return acc
      if (!acc || acc.NumberOfInstallments < curr.NumberOfInstallments)
        return curr
      return acc
    }, null)
  )
}

export function getCategories(product: any) {
  return product.categories[0]
    .split('/')
    .filter((str: string) => str.length)
    .join(' > ')
}

export function getDescriptionAttributes(sku: any) {
  return sku.complementName.replace(
    '<ul>',
    '<ul style="padding-left:15px; margin:0px;">'
  )
}

export function formatPrice(price: number) {
  const intPrice = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(price)
  return intPrice
    .replace(/(\$|\.)/g, '')
    .replace(/^\s*$/g, '')
    .replace(',', '.')
    .trim()
}

export function formatPriceRoundOut(price: number) {
  if (isNaN(price) || typeof price !== 'number') {
    console.error('La entrada debe ser un número válido.');
    return 'Entrada Inválida';
  }

  // Redondea hacia arriba si el decimal es mayor o igual a .50
  const roundedPrice = Math.floor(price) + (price % 1 >= 0.50 ? 1 : 0);

  const formattedPrice = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(roundedPrice);

  return formattedPrice.replace(/[\$\.\s]/g, '');
}

export function getOnePaymentInfo(product: any, discounts: any) {
  const { seller } = extractInfo(product)
  const price = seller.commertialOffer.Price

    const onePayDiscount = discounts.onePayDiscount
    const discountPrice = price * (onePayDiscount / 100)
    const onePayPrice = seller.commertialOffer.Price - discountPrice

    return { price: onePayPrice, percentage: onePayDiscount, discountPrice }

  return null
}
