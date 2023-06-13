import { Test } from '@nestjs/testing'
import { DeepMocked, createMock } from '@golevelup/ts-jest'
import { UserService } from '../user/user.service'
import { User } from '../user/user.entity'
import { MinecraftService } from './minecraft.service'
import { WebSocketGateway } from '../websocket/websocket.gateway'

const createUser = (user: Partial<User> = {}) => {
  const retVal = new User()
  retVal.id = user.id || 1
  retVal.isActive = user.isActive || true
  retVal.nonce = user.nonce || 'randomNonce'
  retVal.publicAddress =
    user.publicAddress || '0x2061dd3a9f09186b5CD82436467dDB79dC737227'
  retVal.mojangId = user.mojangId || 'd772f296-60a0-4917-bf8f-7f33ffed41d9'
  retVal.lastKnownRegion = user.lastKnownRegion || '1'
  retVal.dateJoined = user.dateJoined || new Date()
  retVal.lastLogin = user.lastLogin || new Date()
  retVal.isSuperUser = user.isSuperUser || true
  retVal.ensName = user.ensName || 'carsonweeks.eth'
  retVal.ensRefresh = user.ensRefresh || new Date()
  retVal.playerHeadKey = user.playerHeadKey || 'playerHeadKey123.png'
  retVal.playerHeadRefresh = user.playerHeadRefresh || new Date()
  retVal.properties = user.properties || []
  return retVal
}

describe('MinecraftService', () => {
  let minecraftService: MinecraftService
  let userService: DeepMocked<UserService>
  let websocketGateway: DeepMocked<WebSocketGateway>

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
  })

  describe('getUser', () => {
    it('should find the user', async () => {
      const findOneFunction = userService.findOne.mockResolvedValueOnce(user)
      const uuid = user.mojangId
      const foundUser = await minecraftService.getUser(uuid)
      expect(foundUser.id).toEqual(user.id)
      expect(findOneFunction).toBeCalledWith({ mojangId: uuid })
    })
  })

  describe('regionEnter', () => {
    it('should find the user', async () => {
        const findOneFunction = userService.findOne.mockResolvedValueOnce(user)
        const emitFunction = websocketGateway.emit
        const uuid = user.mojangId
        const region = "1"
  
        await minecraftService.regionEnter(uuid, region)
  
        expect(findOneFunction).toBeCalledWith({ mojangId: uuid })
        expect(emitFunction).toBeCalledWith('minecraft', 'regionEnter', { region, user })
    })
  })

  describe('playerLeave', () => {
    it('should user who left', async () => {
      const findOneFunction = userService.findOne.mockResolvedValueOnce(user)
      const emitFunction = websocketGateway.emit
      const uuid = user.mojangId

      await minecraftService.playerLeave(uuid)

      expect(findOneFunction).toBeCalledWith({ mojangId: uuid })
      expect(emitFunction).toBeCalledWith('minecraft', 'playerLeave', { user })
    })
  })
})
