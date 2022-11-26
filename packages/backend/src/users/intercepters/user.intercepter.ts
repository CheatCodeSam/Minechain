import { Observable } from "rxjs"
import { Repository } from "typeorm"

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"

import { User } from "../entities/user.entity"
import { UsersService } from "../users.service"

@Injectable()
export class UserInterceptor implements NestInterceptor {
  constructor(private userService: UsersService) {}
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<unknown>> {
    const request = context.switchToHttp().getRequest()
    const { id } = request.session?.passport?.user || { id: null }
    if (!id) return next.handle()
    let user: User
    try {
      user = await this.userService.findOne(id)
    } catch (error) {
      return next.handle()
    }
    request.currentUser = user
    return next.handle()
  }
}
