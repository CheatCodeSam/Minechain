import * as crypto from "crypto"
import { Request } from "express"
import { ExtractJwt, Strategy } from "passport-jwt"
import { User } from "src/users/entities/user.entity"
import { Repository } from "typeorm"

import { Injectable, UnauthorizedException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { InjectRepository } from "@nestjs/typeorm"

import { jwt } from "../types/jwt.type"

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
    if (!request.cookies.fingerprint) throw new UnauthorizedException("Fingerprint required.")
    const hashedFingerprint = crypto
      .createHash("sha256")
      .update(request.cookies.fingerprint)
      .digest("base64")
    if (hashedFingerprint !== payload.fingerprint)
      throw new UnauthorizedException("Fingerprints do not match.")

    return this.userRepo.findOneBy({ id: payload.sub })
  }
}
