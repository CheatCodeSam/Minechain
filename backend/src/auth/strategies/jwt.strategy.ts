import { ExtractJwt, Strategy } from "passport-jwt"
import { PassportStrategy } from "@nestjs/passport"
import { Injectable, UnauthorizedException } from "@nestjs/common"
import { User } from "src/users/entities/user.entity"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { jwt } from "../types/jwt.type"
import { Request } from "express"
import * as crypto from "crypto"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: "secret",
      passReqToCallback: true
    })
  }

  async validate(request: Request, payload: jwt): Promise<User | never> {
    const hashedFingerprint = crypto
      .createHash("sha256")
      .update(request.cookies.fingerprint)
      .digest("base64")
    if (hashedFingerprint !== payload.fingerprint)
      throw new UnauthorizedException("Fingerprints do not match.")

    return this.userRepo.findOneBy({ id: payload.sub })
  }
}
