import { Test } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { DeepMocked, createMock } from '@golevelup/ts-jest'
import { UserService } from '../user/user.service'
import { User } from '../user/user.entity'
import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { ethers } from 'ethers'
import { createUser } from '../testing/utils'

describe('AuthService', () => {
  let authService: AuthService
  let userService: DeepMocked<UserService>
  let user: User

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [AuthService],
    })
      .useMocker(createMock)
      .compile()

    authService = moduleRef.get<AuthService>(AuthService)
    userService = moduleRef.get(UserService)
    user = createUser()
  })

  describe('signIn', () => {
    it('should return the nonce of an existing user', async () => {
      const findOneFunction = userService.findOne.mockResolvedValueOnce(user)
      const createUserFunction = userService.createUser
      const publicAddress =
        '0x2061dd3a9f09186b5CD82436467dDB79dC737227'.toLowerCase()

      const nonce = await authService.signIn(publicAddress)

      expect(createUserFunction).not.toHaveBeenCalled()
      expect(findOneFunction).toBeCalledWith({ publicAddress })
      expect(nonce).toEqual('randomNonce')
    })

    it('should create a user than return a nonce', async () => {
      userService.findOne.mockResolvedValueOnce(null)
      const createUserFunction = userService.createUser.mockResolvedValue(user)
      const publicAddress = '0x2061dd3a9f09186b5CD82436467dDB79dC737227'

      const nonce = await authService.signIn(publicAddress)

      expect(createUserFunction).toHaveBeenCalled()
      expect(nonce).toEqual('randomNonce')
    })
  })

  describe('verify', () => {
    it('should throw on invalid signature', async () => {
      await expect(
        authService.verify(user.publicAddress, '0xbogussignature')
      ).rejects.toThrowError(new ForbiddenException('Signature is invalid.'))
    })

    it('should throw if signature is not linked to user', async () => {
      userService.findOne.mockResolvedValueOnce(null)
      const wallet = ethers.Wallet.createRandom()

      const publicAddress = await wallet.getAddress()
      const nonce = 'secretNonce'
      const signedNonce = await wallet.signMessage(nonce)

      await expect(
        authService.verify(publicAddress, signedNonce)
      ).rejects.toThrowError(
        new NotFoundException('User with public address does not exist.')
      )
    })

    it('should throw if other user signed the nonce', async () => {
      userService.findOne.mockResolvedValueOnce(user)
      const wallet = ethers.Wallet.createRandom()

      const publicAddress = await wallet.getAddress()
      const nonce = 'secretNonce'
      const signedNonce = await wallet.signMessage(nonce)

      await expect(
        authService.verify(publicAddress, signedNonce)
      ).rejects.toThrowError(new ForbiddenException('Invalid public address.'))
    })

    it('should throw if the user signed the wrong nonce', async () => {
      const wallet = ethers.Wallet.createRandom()
      const publicAddress = await wallet.getAddress()

      const userWithUpdatedPublicAddress = createUser({ publicAddress })
      userService.findOne.mockResolvedValueOnce(userWithUpdatedPublicAddress)

      const nonce = 'WRONGNONCE'
      const signedNonce = await wallet.signMessage(nonce)

      await expect(
        authService.verify(publicAddress, signedNonce)
      ).rejects.toThrowError(new ForbiddenException('Invalid public address.'))
    })

    it('should verify a proper nonce and public address', async () => {
      const wallet = ethers.Wallet.createRandom()
      const publicAddress = await wallet.getAddress()

      const userWithUpdatedPublicAddress = createUser({
        publicAddress,
        isActive: true,
      })
      userService.findOne.mockResolvedValueOnce(userWithUpdatedPublicAddress)
      const activateUserFunction = userService.activateUser

      const nonce = userWithUpdatedPublicAddress.nonce
      const signedNonce = await wallet.signMessage(nonce)

      const result = await authService.verify(publicAddress, signedNonce)

      expect(result).toHaveProperty('access_token')
      expect(activateUserFunction).toBeCalledWith(user.id)
    })
  })
})
