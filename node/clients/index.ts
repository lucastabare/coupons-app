import { IOClients } from '@vtex/api'

import Coupons from './coupons'
// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get coupons() {
    return this.getOrSet('coupons', Coupons)
  }
}
