import { IOClients } from '@vtex/api'

import Xml from './xml'
// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get xml() {
    return this.getOrSet('xml', Xml)
  }
}
