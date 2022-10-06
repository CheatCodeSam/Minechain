import { Exclude } from "class-transformer"

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
}
