import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

export default class Vtex extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    console.log("soy el contexto ==> ", context)
    super(`http://pinataar.vtexcommercestable.com.br`, context, {
      ...(options ?? {}),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        //VtexIdclientAutCookie: context.authToken,
        'X-VTEX-API-AppKey': 'vtexappkey-pinataar-BRWUMU',
        'X-VTEX-API-AppToken': 'ZFPTERAXFWXJCXCABGFBOWTDXJEXSJSAZGSFGFYRBNWVSEMWWBQDUNYDCBQSDOVMNZSVKNOUFRJJDRBVYADSIGMLDDOMDDDPMTAJSHDDZVMJJPKYWXPPIABGXGQNTAXV',
        'X-Vtex-Use-Https': 'true',
      },
    })
  }

  public async setCoupons(body: any): Promise<any> {
    try {
      const response = await this.http.post(
        `/api/rnb/pvt/multiple-coupons`,
        body,
        {
          headers: {
            'Authorization': `Bearer ${this.context.authToken}`,
          },
        }
      )

      return response
    } catch (e) {
      console.error('[ERROR] Creating Coupons:', e)
      throw e
    }
  }
}
