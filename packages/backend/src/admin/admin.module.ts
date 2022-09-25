import { AdminModule as AdminJsModule } from "@adminjs/nestjs"
import * as AdminJSTypeorm from "@adminjs/typeorm"
import AdminJS from "adminjs"

import { Module } from "@nestjs/common"

import { Session } from "../auth/session.entity"
import { Token } from "../blockchain/token.entity"
import { User } from "../users/entities/user.entity"
import { ExpressCustomLoader } from "./express.loader"

AdminJS.registerAdapter({
  Resource: AdminJSTypeorm.Resource,
  Database: AdminJSTypeorm.Database
})

@Module({
  imports: [
    AdminJsModule.createAdminAsync({
      customLoader: ExpressCustomLoader,
      useFactory: () => ({
        adminJsOptions: {
          rootPath: "/admin",
          branding: { companyName: "Minechain", withMadeWithLove: false, logo: false },
          locale: {
            language: "en",
            translations: {
              resources: {
                Token: {
                  properties: {
                    userId: "User"
                  }
                }
              },
              messages: {
                loginWelcome: ""
              },
              labels: {
                loginWelcome: "Minechain Admin"
              }
            }
          },
          resources: [
            {
              resource: User,
              options: {
                properties: {
                  publicAddress: {
                    isTitle: true
                  },
                  nonce: {
                    isVisible: false
                  }
                }
              }
            },
            Token,
            Session
          ]
        }
      })
    })
  ]
})
export class AdminModule {}
