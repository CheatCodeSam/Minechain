import { IsNotEmpty, IsString } from "class-validator"

export class VerificationDto {
  @IsNotEmpty()
  @IsString()
  publicAddress: string

  @IsNotEmpty()
  @IsString()
  signedNonce: string
}
