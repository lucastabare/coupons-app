// import { json } from 'co-body';
import xml2js from 'xml2js'

import formatProducts from '../utils/formatProduct'

export async function xml(ctx: Context, next: () => Promise<any>) {
  let xmlResp
  const {
    clients: { xml },
    vtex: {
      route: { params },
    },
  } = ctx
  const { source: sourceParam } = params
  let source: string = Array.isArray(sourceParam) ? sourceParam[0] : sourceParam
  const products = await xml.getProducts(source)

  const sortedProducts = products.sort((a: any, b: any) => {
    if (parseInt(a.productId) > parseInt(b.productId)) return 1
    if (parseInt(b.productId) > parseInt(a.productId)) return -1
    return 0
  })
  // console.log('Length', sortedProducts.length)
  const formattedProducts = await formatProducts(sortedProducts, source, ctx)

  const builder = new xml2js.Builder()

  if (source === 'google') {
    xmlResp = builder.buildObject({
      rss: {
        $: {
          'xmlns:g': 'http://base.google.com/ns/1.0',
          version: '2.0',
        },
        channel: {
          item: formattedProducts,
        },
      },
    })
  }

  if (source === 'facebook') {
    xmlResp = builder.buildObject({
      rss: {
        $: {
          'xmlns:g': 'http://base.google.com/ns/1.0',
          version: '2.0',
        },
        channel: {
          item: formattedProducts,
        },
      },
    })
  }

  if (source === 'emailmarketing') {
    xmlResp = builder.buildObject({
      feed: {
        entry: formattedProducts,
      },
    })
  }

  ctx.set('Content-Type', 'text/xml; charset=utf-8')

  ctx.status = 200
  ctx.body = xmlResp
    ?.replace(
      new RegExp('<custom_comment_1/>', 'g'),
      '<!-- porcentaje % de descuento estandar del producto -->'
    )
    .replace(
      new RegExp('<custom_comment_2/>', 'g'),
      '<!-- PVP del producto en 1 pago -->'
    )
    .replace(
      new RegExp('<custom_comment_3/>', 'g'),
      '<!-- porcentaje % de descuento en 1 pago -->'
    )
    .replace(
      new RegExp('<custom_comment_4/>', 'g'),
      '<!-- monto $ de descuento en 1 pago -->'
    )
    .replace(
      new RegExp('<sale_price_comment/>', 'g'),
      '<!-- Se oculta el campo "sale_price" por ser igual a "price" -->'
    )
    .replace(
      new RegExp('<custom_label_0_comment/>', 'g'),
      '<!-- Categoria del producto -->'
    )
    .replace(
      new RegExp('<custom_comment_new/>', 'g'),
      ' <!-- Valor y cantidad de cuotas -->'
    )

  await next()
}
