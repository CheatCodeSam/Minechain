import { AbstractLoader, AdminModuleOptions } from "@adminjs/nestjs"
import { ExpressLoader } from "@adminjs/nestjs/build/loaders/express.loader"
import AdminJS from "adminjs"

import { Injectable } from "@nestjs/common"
import { AbstractHttpAdapter } from "@nestjs/core"

@Injectable()
export class ExpressCustomLoader extends AbstractLoader {
  public register(admin: AdminJS, httpAdapter: AbstractHttpAdapter, options: AdminModuleOptions) {
    console.log("Custom loader")
    console.log("Custom loader")
    new ExpressLoader().register(admin, httpAdapter, options)
  }
}
