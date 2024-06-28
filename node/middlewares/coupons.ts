import { json } from 'co-body'

export async function setCoupons(ctx: Context, next: () => Promise<any>) {
  ctx.set('Content-type', 'application/json')

  const body = await json(ctx.req)

  if (!body || !Array.isArray(body) || body.length === 0) {
    ctx.status = 400
    ctx.body = { reason: 'Invalid request body' }
    return next()
  }

  const { clients: { coupons } } = ctx

  try {
    await coupons.setCoupons(body)
    ctx.body = { message: 'Success' }
    ctx.status = 200
  } catch (e) {
    const { response } = e
    if (response && response.status === 400) {
      ctx.status = 400
      ctx.body = { reason: response.data }
    } else {
      ctx.status = 500
      ctx.body = { reason: 'Internal server error' }
    }
    ctx.vtex.logger.error({ error: e })
  }

  await next()
}
