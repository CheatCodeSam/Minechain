import { IsNotEmpty, IsString } from "class-validator"

export class SignInDto {
  @IsNotEmpty()
  @IsString()
  publicAddress: string
}
