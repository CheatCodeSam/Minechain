import { Test } from '@nestjs/testing'
import { DeepMocked, createMock } from '@golevelup/ts-jest'
import { User } from '../user/user.entity'
import { PlayerHeadService } from './player-head.service'
import { createUser } from '../testing/utils'
import { StorageService } from '../storage/storage.service'
import { HttpService } from '@nestjs/axios'
import { of } from 'rxjs'

describe('PlayerHeadService', () => {
  let playerHeadService: PlayerHeadService
  let storageService: DeepMocked<StorageService>
  let httpService: DeepMocked<HttpService>

  let user: User

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [PlayerHeadService],
    })
      .useMocker(createMock)
      .compile()

    playerHeadService = moduleRef.get<PlayerHeadService>(PlayerHeadService)
    storageService = moduleRef.get(StorageService)
    httpService = moduleRef.get(HttpService)

    user = createUser()
  })

  describe('getPlayerHead', () => {
    it('should call store the correct key', async () => {
      user.publicAddress = '0x2061dd3a9f09186b5CD82436467dDB79dC737227'
      const uploadFunction = storageService.upload
      httpService.get.mockReturnValue(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        of({
          data: 'mockBuffer',
          headers: {
            'content-type': 'image/png',
          },
        })
      )

      await playerHeadService.getPlayerHead(user)

      expect(uploadFunction).toBeCalledWith(
        'player-head/0x2061dd3a9f09186b5CD82436467dDB79dC737227.png',
        'mockBuffer',
        'image/png'
      )
    })

    it('should call get the correct uri', async () => {
      user.mojangId = 'c77512ae-9583-4a0d-9971-7f9ed6533c39'
      const getFunction = httpService.get.mockReturnValue(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        of({
          data: 'mockBuffer',
          headers: {
            'content-type': 'image/png',
          },
        })
      )

      await playerHeadService.getPlayerHead(user)

      expect(getFunction).toBeCalledWith(
        'https://crafatar.com/avatars/' +
          'c77512ae-9583-4a0d-9971-7f9ed6533c39',
        {
          responseType: 'arraybuffer',
        }
      )
    })
  })
})
