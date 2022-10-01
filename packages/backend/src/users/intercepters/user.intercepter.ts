import { Observable } from "rxjs"
import { Repository } from "typeorm"

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"

import { User } from "../entities/user.entity"

@Injectable()
export class UserInterceptor implements NestInterceptor {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<unknown>> {
    const request = context.switchToHttp().getRequest()

    const { id } = request.session.passport.user || { id: null }

    if (!id) {
      return next.handle()
    }

    const user = await this.userRepo.findOneBy({ id })
    if (!user) {
      return next.handle()
    }
    console.log(user)

    request.currentUser = user
    return next.handle()
  }
}
