import { EvmChain } from "@moralisweb3/evm-utils"
import Moralis from "moralis"
import { Repository } from "typeorm"

import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"

import { User } from "./entities/user.entity"

const gateway = "https://ipfs.moralis.io:2053/ipfs/"

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async getNfts(publicAddress: string) {
    const nfts = await Moralis.EvmApi.nft.getWalletNFTs({
      chain: EvmChain.GOERLI,
      address: publicAddress
    })
    const images: string[] = []
    nfts.result.forEach(async (nft) => {
      const image = nft.format().metadata.image as string
      if (image.startsWith("http")) {
        images.push(image)
      } else if (image.startsWith("ipfs")) {
        const ipfsID = image.replace("ipfs://", "")
        const ipfsGateway = gateway + ipfsID
        images.push(ipfsGateway)
      }
    })
    console.log(images)

    return images
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOneBy({ id })
    if (!user) throw new NotFoundException(`User with id ${id} not found.`)
    return user
  }
}
