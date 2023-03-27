import { IsNotEmpty, IsString } from 'class-validator'

export class MojangIdDto {
  @IsNotEmpty()
  @IsString()
  uuid: string
}
