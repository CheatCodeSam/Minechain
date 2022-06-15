export type jwt = {
  iss: string
  aud: string
  nbf: string
  jti: number
  sub: number
  exp: number
  iat: number
  context?: object
}
