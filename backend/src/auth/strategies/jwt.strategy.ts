import { ExtractJwt, Strategy } from "passport-jwt"
import { PassportStrategy } from "@nestjs/passport"
import { Injectable } from "@nestjs/common"
import { User } from "src/users/entities/user.entity"
import { TokensService } from "../tokens.service"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { jwt } from "../types/jwt.type"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: "secret"
    })
  }

  async validate(payload: jwt): Promise<User | never> {
    return this.userRepo.findOneBy({ id: payload.sub })
  }
}
