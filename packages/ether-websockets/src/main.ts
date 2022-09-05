import { Minechain, abi } from "@./abi-typings"
import * as amqplib from "amqplib"
import * as ethers from "ethers"

async function main() {
  const conn = await amqplib.connect("amqp://localhost")

  const ch1 = await conn.createChannel()
  await ch1.assertExchange("blockchain", "direct")

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

  const webSocketProvider = new ethers.providers.WebSocketProvider("ws://localhost:8545")
  const contract = new ethers.Contract(contractAddress, abi, webSocketProvider) as Minechain

  const filter = contract.filters.Transfer(null, null, null)
  contract.queryFilter(filter)
  contract.on(filter, (from, to, value, event) => {
    ch1.publish(
      "blockchain",
      "transfer",
      Buffer.from(
        JSON.stringify({
          from: from,
          to: to,
          value: value.toString(),
          data: event
        })
      )
    )
  })
}

main()
