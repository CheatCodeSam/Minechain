/* eslint-disable @typescript-eslint/no-explicit-any */
import { plainToInstance } from "class-transformer"
import { Observable } from "rxjs"
import { map } from "rxjs/operators"

import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common"

import { UserDto } from "./dto/user.dto"

export function Serialize(dto: any) {
  return UseInterceptors(new SerializeInterceptor(UserDto))
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    return handler.handle().pipe(
      map((data: any) => {
        return plainToInstance(this.dto, data, {})
      })
    )
  }
}
