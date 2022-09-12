import { Injectable } from "@nestjs/common"

@Injectable()
export class BlockchainService {
  //TODO
  async transfer(from: string, to: string, value: string, data) {
    const zeroAddress = "0x0000000000000000000000000000000000000000"
    if (from === zeroAddress) {
      console.log("inital buy")

      // this.initalBuy()
    } else console.log("Bought from another user")

    // this.transferTokensFromUser()

    // keep this
    console.log(from, to, value)
  }
}
