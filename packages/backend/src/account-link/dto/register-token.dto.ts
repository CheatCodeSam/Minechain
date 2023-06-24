import { IsNotEmpty, IsString } from 'class-validator'

export class RegisterTokenDto {
  @IsNotEmpty()
  @IsString()
  token: string
}
