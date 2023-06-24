import { Test } from '@nestjs/testing'
import { DeepMocked, createMock } from '@golevelup/ts-jest'
import { UserService } from '../user/user.service'
import { User } from '../user/user.entity'
import { MinecraftService } from './minecraft.service'
import { WebSocketGateway } from '../websocket/websocket.gateway'
import { createUser } from '../testing/utils'

describe('MinecraftService', () => {
  let minecraftService: MinecraftService
  let userService: DeepMocked<UserService>
  let websocketGateway: DeepMocked<WebSocketGateway>
  let mojangUUID: string

  let user: User

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [MinecraftService],
    })
      .useMocker(createMock)
      .compile()

    minecraftService = moduleRef.get<MinecraftService>(MinecraftService)
    userService = moduleRef.get(UserService)
    websocketGateway = moduleRef.get(WebSocketGateway)
    user = createUser()
    mojangUUID = 'd772f296-60a0-4917-bf8f-7f33ffed41d9'
  })

  describe('getUser', () => {
    it('should find the user', async () => {
      const findOneFunction = userService.findOne.mockResolvedValueOnce(user)
      const uuid = mojangUUID
      const foundUser = await minecraftService.getUser(uuid)
      expect(foundUser.id).toEqual(user.id)
      expect(findOneFunction).toBeCalledWith({ mojangId: uuid })
    })
  })

  describe('regionEnter', () => {
    it('should find the user', async () => {
      const findOneFunction = userService.findOne.mockResolvedValueOnce(user)
      const emitFunction = websocketGateway.emit
      const uuid = mojangUUID
      const region = '1'

      await minecraftService.regionEnter(uuid, region)

      expect(findOneFunction).toBeCalledWith({ mojangId: uuid })
      expect(emitFunction).toBeCalledWith('minecraft', 'regionEnter', {
        region,
        user,
      })
    })
  })

  describe('playerLeave', () => {
    it('should user who left', async () => {
      const findOneFunction = userService.findOne.mockResolvedValueOnce(user)
      const emitFunction = websocketGateway.emit
      const uuid = mojangUUID

      await minecraftService.playerLeave(uuid)

      expect(findOneFunction).toBeCalledWith({ mojangId: uuid })
      expect(emitFunction).toBeCalledWith('minecraft', 'playerLeave', { user })
    })
  })
})
