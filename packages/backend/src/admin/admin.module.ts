import { AdminModule as AdminJsModule } from "@adminjs/nestjs"
import * as AdminJSTypeorm from "@adminjs/typeorm"
import AdminJS from "adminjs"

import { Module } from "@nestjs/common"

import { Session } from "../auth/session.entity"
import { Token } from "../blockchain/token.entity"
import { User } from "../users/entities/user.entity"
import { ExpressCustomLoader } from "./express.loader"

const DEFAULT_ADMIN = {
  email: "admin@example.com",
  password: "password"
}

const authenticate = async (email: string, password: string) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN)
  }
  return null
}

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
          resources: [
            {
              resource: User,
              options: {
                properties: {
                  publicAddress: {
                    isTitle: true
                  }
                }
              }
            },

            Session,
            Token
          ]
        },
        auth: {
          authenticate,
          cookieName: "adminjs",
          cookiePassword: "secret"
        },
        sessionOptions: {
          resave: true,
          saveUninitialized: true,
          secret: "secret"
        }
      })
    })
  ]
})
export class AdminModule {}
