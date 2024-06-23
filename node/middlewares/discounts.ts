import { getBucketName } from "../utils/bucket"

function extractBody(req: Context['req']): Promise<any> {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (chunk) => {
      data += chunk
    })
    req.on('error', (err) => {
      reject(err)
    })
    req.on('end', () => {
      try {
        const obj = JSON.parse(data)
        return resolve(obj)
      } catch (e) {
        return resolve({})
      }
    })
  })
}

const DISCOUNT_HASH =
  '2d33298f576f7df98f4d910567bcc9717a38bfb22e414139e1c7712de6776a82'

interface RequestBody {
  secret: string
  onepaydiscount: number
}

export async function setDiscounts(ctx: Context, next: () => Promise<any>) {

  ctx.set('Content-type', 'application/json')

  const body = (await extractBody(ctx.req)) as RequestBody

  if (body.secret !== DISCOUNT_HASH) {
    ctx.res.statusCode = 403
    ctx.body = JSON.stringify({ reason: 'Secret not valid' })
    return next()
  }

  if (body.onepaydiscount < 0 || body.onepaydiscount > 100) {
    ctx.res.statusCode = 400
    ctx.body = JSON.stringify({ reason: 'onepaydiscount not valid' })
    return next()
  }

  const saveKey = getBucketName(ctx.vtex.production)

  try {
    await ctx.clients.vbase.saveJSON(saveKey, 'discounts', {
      onePayDiscount: body.onepaydiscount,
    })
  } catch (e) {
    ctx.vtex.logger.error({ error: e })
  }

  ctx.body = JSON.stringify({
    message: 'Success',
  })
  return next()
}

export async function getDiscounts(ctx: Context, next: () => Promise<any>) {
  ctx.set('Content-type', 'application/json')

  const saveKey = getBucketName(ctx.vtex.production)

  try {
    const response = await ctx.clients.vbase
      .getJSON(saveKey, 'discounts', true)
      .then((r) => r)
      .catch((e) => console.log('ERROR', e))
    // )) ?? { onePayDiscount: 0 }
    ctx.body = response
    ctx.res.statusCode = 200
  } catch (e) {
    ctx.vtex.logger.error({ error: e })
    ctx.res.statusCode = 400
    ctx.body = {
      message: 'error',
      meta: e,
    }
  }

  return next()
}
