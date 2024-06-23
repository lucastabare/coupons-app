import * as ProductUtils from './product'

function formatPrice(n: number) {
  return `${ProductUtils.formatPriceRoundOut(n)} ARS`
}

export function facebook(product: any, discounts: any) {

  const { items, sku, seller, images } = ProductUtils.extractInfo(product)

  const item: any = {}

  const listPrice = seller.commertialOffer.ListPrice
  const price = seller.commertialOffer.Price
  const standardDiscount = 100 - Math.ceil((price / listPrice) * 100)

  const quantity = ProductUtils.getQuantity(items)
  const installments = ProductUtils.getInstallments(seller)
  const categories = ProductUtils.getCategories(product)
  const descriptionAttributes = ProductUtils.getDescriptionAttributes(sku)

  item['product_id'] = product.productId
  item['id'] = sku.itemId
  item['product_sku'] = sku.referenceId?.at(0)?.Value
  item['mpn'] = !!sku.ean ? '' : item['product_sku']
  item['gtin'] = sku.ean
  item['title'] = product.productName
  item['brand'] = product.brand
  item['categories'] = ''
  item['product_type'] = `${categories}`
  item['description_attributes'] = descriptionAttributes
  item['description'] = product.description
  item['condition'] = 'new'
  item[
    'link'
  ] = `https://www.tidi.com.ar/${product.linkText}/p`
  item['image_link'] = images && images.length ? images[0].imageUrl : ''
  item['availability'] = quantity > 0 ? 'in_stock' : 'out_of_stock'
  item['price'] = formatPrice(listPrice)
  item['custom_comment_1'] = ''

  item['custom_label_1'] = standardDiscount

  if (standardDiscount === 0) item['sale_price_comment'] = ''
  else item['sale_price'] = formatPrice(price)

  if (installments) {
    item['installment'] = {
      ['amount']: installments && formatPrice(installments.Value),
      ['months']: installments && installments.NumberOfInstallments
    }
  }

  const onePaymentInfo = ProductUtils.getOnePaymentInfo(product, discounts)

  if (onePaymentInfo !== null) {
    item['custom_comment_2'] = ''
    item['custom_label_2'] = formatPrice(onePaymentInfo.price)
    item['custom_comment_3'] = ''
    item['custom_label_3'] = onePaymentInfo.percentage
    item['custom_comment_4'] = ''
    item['custom_label_4'] = formatPrice(onePaymentInfo.discountPrice)
  }

  return item
}