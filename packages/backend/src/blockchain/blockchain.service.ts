import { Injectable } from "@nestjs/common"

@Injectable()
export class BlockchainService {
  //TODO
  async transfer(from: string, to: string, value: string, data) {
    // keep this
    console.log(from, to, value)
  }
}