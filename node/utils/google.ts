import * as ProductUtils from './product'

function formatPrice(n: number) {
  return `${ProductUtils.formatPriceRoundOut(n)} ARS`
}

export function google(product: any, discounts: any) {
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
  item['g:id'] = sku.itemId
  item['product_sku'] = sku.referenceId?.at(0)?.Value
  item['g:mpn'] = !!sku.ean ? '' : item['product_sku']
  item['g:gtin'] = sku.ean
  item['g:title'] = product.productName
  item['g:brand'] = product.brand
  item['categories'] = ''
  item['g:product_type'] = `${categories}`
  item['description_attributes'] = descriptionAttributes
  item['g:description'] = product.description
  item['g:condition'] = 'new'
  item[
    'g:link'
  ] = `https://www.tidi.com.ar/${product.linkText}/p`
  item['g:image_link'] = images && images.length ? images[0].imageUrl : ''
  item['g:availability'] = quantity > 0 ? 'in_stock' : 'out_of_stock'
  item['g:price'] = formatPrice(listPrice)
  item['custom_comment_1'] = ''

  item['g:custom_label_1'] = `<![CDATA[ ${categories} ]]>`
  item['g:custom_label_1'] = standardDiscount

  if (standardDiscount === 0) item['sale_price_comment'] = ''
  else item['g:sale_price'] = formatPrice(price)

  if (installments) {
    item['g:installment'] = {
      ['g:amount']: installments && formatPrice(installments.Value),
      ['g:months']: installments && installments.NumberOfInstallments
    }
  }

  const onePaymentInfo = ProductUtils.getOnePaymentInfo(product, discounts)
  if (onePaymentInfo !== null) {
    item['custom_comment_2'] = ''
    item['g:custom_label_2'] = formatPrice(onePaymentInfo.price)
    item['custom_comment_3'] = ''
    item['g:custom_label_3'] = onePaymentInfo.percentage
    item['custom_comment_4'] = ''
    item['g:custom_label_4'] = formatPrice(onePaymentInfo.discountPrice)
  }

  return item
}
