import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

export default class Vtex extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(`http://api.vtexcommercestable.com.br`, context, {
      ...(options ?? {}),
      headers: {
        ...(options?.headers ?? {}),
        'Content-Type': 'application/json',
        VtexIdclientAutCookie: context.authToken,
        'X-Vtex-Use-Https': 'true',
      },
    })
  }

  public async getProducts(source: string): Promise<any> {

    let extraParams: any = {
      google: '&fq=productClusterIds:164&fq=isAvailablePerSalesChannel_1:1',
      facebook: '&fq=productClusterIds:164&fq=isAvailablePerSalesChannel_1:1',
      emailmarketing: '&fq=productClusterIds:165&fq=isAvailablePerSalesChannel_1:1',
    }

    try {
      const products: Array<any> = []
      let from: number = 0
      try {
        while (true) {
          const { data, status } = await this.http.getRaw(
            `/api/catalog_system/pub/products/search?_from=${from}&_to=${
              from + 49
            }${extraParams[source] ?? ''}`,
            {
              params: {
                an: 'tiendasdigitalesar',
              },
            }
          )

          from += 50
          products.push(...data)
          if (status !== 206) break
        }
      } catch (e) {
        console.log('error', e)
      }

      return products

    } catch (e) {
      console.error('[ERROR]', e)
      return undefined
    }
  }
}
;('')
