import * as crypto from "crypto"
import { TokenExpiredError } from "jsonwebtoken"
import { generate } from "short-uuid"
import { Repository } from "typeorm"

import { Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { InjectRepository } from "@nestjs/typeorm"

import { User } from "../users/entities/user.entity"
import { RefreshToken } from "./entities/refreshtoken.entity"
import { jwt } from "./types/jwt.type"

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(RefreshToken) private refreshTokenRepo: Repository<RefreshToken>,
    private jwtService: JwtService
  ) {}

  async refresh(token: string) {
    const decodedToken = this.decodeToken(token)
    const storedToken = await this.refreshTokenRepo.findOneBy({ id: decodedToken.jti })

    if (!storedToken) throw new UnauthorizedException("Refresh token not found")
    if (storedToken.blacklisted) throw new UnauthorizedException("Token is blacklisted.")
    storedToken.blacklisted = true
    this.refreshTokenRepo.save(storedToken)

    const user = await this.userRepo.findOneBy({ id: decodedToken.sub })
    return this.issueTokens(user)
  }

  async issueTokens(user: User) {
    const fingerprint = generate()
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(user, fingerprint),
      this.generateRefreshToken(user)
    ])
    return {
      fingerprint,
      user,
      accessToken,
      refreshToken
    }
  }

  async blacklistToken(token: string) {
    const decodedToken = this.decodeToken(token)
    const storedToken = await this.refreshTokenRepo.findOneBy({ id: decodedToken.jti })

    storedToken.blacklisted = true
    this.refreshTokenRepo.save(storedToken)
  }

  private async generateAccessToken(user: User, fingerprint: string): Promise<string> {
    const expiration = "5m"
    const domain = "localhost"
    const userId = user.id

    return this.jwtService.signAsync(
      { fingerprint: crypto.createHash("sha256").update(fingerprint).digest("base64") },
      {
        expiresIn: expiration,
        issuer: domain,
        audience: domain,
        subject: userId.toString()
      }
    )
  }

  private async generateRefreshToken(user: User): Promise<string> {
    const expiration = "14d"
    const domain = "localhost"
    const userId = user.id

    const refreshTokenModel = this.refreshTokenRepo.create({ user })
    await this.refreshTokenRepo.save(refreshTokenModel)

    return this.jwtService.signAsync(
      {},
      {
        expiresIn: expiration,
        issuer: domain,
        audience: domain,
        subject: userId.toString(),
        jwtid: refreshTokenModel.id.toString()
      }
    )
  }

  private decodeToken(token: string) {
    if (!token) throw new UnauthorizedException("Missing Token")
    try {
      return this.jwtService.verify<jwt>(token)
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnauthorizedException("Refresh token expired.")
      } else {
        throw new UnauthorizedException("Refresh token malformed.")
      }
    }
  }
}
