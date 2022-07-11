import { IsNotEmpty, IsString } from "class-validator"

export class PublicAddressDto {
  @IsNotEmpty()
  @IsString()
  publicAddress: string
}
