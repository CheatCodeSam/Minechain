import { DeepMocked, createMock } from '@golevelup/ts-jest'
import { TestingModule, Test } from '@nestjs/testing'
import { User } from './user.entity'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { createUser } from '../testing/utils'

describe('UserController', () => {
  let userController: UserController
  let userService: DeepMocked<UserService>
  let user: User

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
    })
      .useMocker(createMock)
      .compile()

    userController = moduleRef.get<UserController>(UserController)
    userService = moduleRef.get(UserService)
    user = createUser()
  })

  describe('whoami', () => {
    it('should return the current user', async () => {
      expect(await userController.whoami(user)).toEqual(user)
    })
  })

  describe('findOne', () => {
    it('should return a user by their public address', async () => {
      const publicAddress = user.publicAddress
      const foundOneFunction = userService.findOne

      await userController.findOne(publicAddress)

      expect(foundOneFunction).toHaveBeenCalledWith({
        publicAddress: publicAddress.toLowerCase(),
      })
    })
  })

  describe('refreshEns', () => {
    it('should refresh the ENS of a user', async () => {
      const updateEnsFunction = userService.updateEns

      await userController.refreshEns(user)

      expect(updateEnsFunction).toHaveBeenCalledWith(user)
    })
  })

  describe('refreshHead', () => {
    it('should refresh the head of a user', async () => {
      const updatePlayerHeadFunction = userService.updatePlayerHead

      await userController.refreshHead(user)

      expect(updatePlayerHeadFunction).toHaveBeenCalledWith(user)
    })
  })
})
