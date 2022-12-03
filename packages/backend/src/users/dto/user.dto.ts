import { Exclude, Expose } from "class-transformer"

export class UserDto {
  id: number

  isActive: boolean

  @Exclude()
  nonce: string

  publicAddress: string

  mojangId: string

  dateJoined: Date

  lastLogin: Date

  isSuperUser: boolean

  @Exclude()
  tokens: any[]

  @Expose()
  get shortName(): string {
    return (
      this.publicAddress.substring(0, 5) +
      "..." +
      this.publicAddress.substring(this.publicAddress.length - 4)
    )
  }

  @Expose({ name: "tokens" })
  get getTokens(): any[] {
    if (this.tokens) return this.tokens.map((t) => t.tokenId)
    else return []
  }

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial)
  }
}
