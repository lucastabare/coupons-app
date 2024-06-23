import { google } from './google'
import { facebook } from './facebook'
import { emailmarketing } from './emailmarketing'
import { getBucketName } from './bucket'
interface FormatProduct {
  google: any
  facebook: any
  emailmarketing: any
  emblue: any
}

const formatPriceEmblueWithComa = (price: number) => {
  const intPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price)
  return intPrice.replace(/(\$|\R)/g, '').trim()
}

const formatPriceEmblue = (price: number) => {
  const intPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Math.floor(price))
  return intPrice
    .replace(/(\$|\R)/g, '')
    .replace(',00', '')
    .trim()
}

// const formatPrice = (price: number) => {
//   const intPrice = new Intl.NumberFormat('es-AR', {
//     style: 'currency',
//     currency: 'ARS',
//   }).format(price)
//   return intPrice
//     .replace(/(\$|\.)/g, '')
//     .replace(/^\s*$/g, '')
//     .replace(',', '.')
//     .trim()
// }

// const formatPriceGoogle = (price: number) => {
//   const intPrice = new Intl.NumberFormat('es-AR', {
//     style: 'currency',
//     currency: 'ARS',
//   }).format(Math.floor(price))
//   return intPrice
//     .replace(/(\$|\.)/g, '')
//     .replace(/^\s*$/g, '')
//     .replace(',', '.')
//     .trim()
// }

// const serialize = (obj: any) =>
//   Object.keys(obj)
//     .map((key) => `${key}=${encodeURIComponent(obj[key])}`)
//     .join('&')

const formatProduct: FormatProduct = {
  google,
  facebook,
  emailmarketing,
  emblue(product: any, discounts: any) {
    const item: any = {}
    const { items } = product
    const [sku] = items
    const [seller] = sku.sellers
    const installments =
      seller.commertialOffer.IsAvailable &&
      seller.commertialOffer.Installments.reduce((acc: any, curr: any) => {
        if (curr.InterestRate > 0) return acc
        if (!acc || acc.NumberOfInstallments < curr.NumberOfInstallments)
          return curr
        return acc
      }, null)
    const { images } = sku
    const image = images && images.length ? images[0].imageUrl : ''
    const description = product.description.replace(
      '<ul>',
      '<ul style="padding-left:15px; margin:0px;">'
    )
    const additional_description = sku.complementName.replace(
      '<ul>',
      '<ul style="padding-left:15px; margin:0px;">'
    )
    const categories = product.categories[0]
      .split('/')
      .filter((str: string) => str.length)
      .join(' > ')
    // const discount = seller.commertialOffer.PriceWithoutDiscount - seller.commertialOffer.Price;

    const listPrice = seller.commertialOffer.ListPrice
    const price = seller.commertialOffer.Price
    // console.log(product.productId,{listPrice,price},"primer")
    item.product_id = product.productId
    item.sku = sku.itemId
    item.name = product.productName
    item.description = additional_description
    item.description_uno = description
    item.categories = `<![CDATA[ ${categories} ]]>`
    item.brand = product.brand
    item.link = `https://www.tidi.com.ar/${product.linkText}/p`
    item.linkAlt = `https://www.tidi.com.ar/${product.linkText}/p`
    item.image = image
    item.price = formatPriceEmblue(price)
    item.list_price = formatPriceEmblue(listPrice)
    item.price_without_discount = formatPriceEmblue(
      seller.commertialOffer.ListPrice
    )
    item.cuotas = installments && installments.NumberOfInstallments
    item.price_cuota =
      installments &&
      installments.Value &&
      formatPriceEmblueWithComa(installments.Value)

    const standardDiscount = 100 - Math.ceil((price / listPrice) * 100)
    item.discount_percentage_standard = standardDiscount

    if (product['1 Pago']) {
      const onePayDiscount = discounts.onePayDiscount
      const discountPrice = price * (onePayDiscount / 100)
      const onePayPrice = seller.commertialOffer.Price - discountPrice
      item.discount_percentage_1_payment = onePayDiscount
      item.price_1_payment = formatPriceEmblue(onePayPrice)
    }

    return item
  },
}

const formatProducts = async (
  products: any[],
  source: string,
  ctx: Context
) => {
  const productsClone = [...products]
  const storeKey = getBucketName(ctx.vtex.production)
  const discounts = await ctx.clients.vbase.getJSON(storeKey, 'discounts')

  return productsClone.map((product) => {
    return formatProduct[source as keyof FormatProduct](product, discounts)
  })
}

export default formatProducts
