import { ExecutionContext, UnauthorizedException, createParamDecorator } from "@nestjs/common"

export const Cookies = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  if (!request.cookies || !request.cookies[data]) throw new UnauthorizedException("Missing Cookie")
  return request.cookies[data]
})
