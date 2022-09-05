import { Minechain, abi } from "@./abi-typings"
import * as ethers from "ethers"

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

const webSocketProvider = new ethers.providers.WebSocketProvider("ws://localhost:8545")
const contract = new ethers.Contract(contractAddress, abi, webSocketProvider) as Minechain

const filter = contract.filters.Transfer(null, null, null)
contract.queryFilter(filter)
contract.on(filter, (from, to, value, event) => {
  console.log({
    from: from,
    to: to,
    value: value.toString(),
    data: event
  })
})
