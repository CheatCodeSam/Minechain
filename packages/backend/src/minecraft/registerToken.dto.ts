import { IsNotEmpty, IsString } from "class-validator"

export class registerToken {
  @IsNotEmpty()
  @IsString()
  token: string
}
