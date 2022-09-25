import { AbstractLoader, AdminModuleOptions } from "@adminjs/nestjs"
import { ExpressLoader } from "@adminjs/nestjs/build/loaders/express.loader"
import AdminJS from "adminjs"

import { Injectable } from "@nestjs/common"
import { AbstractHttpAdapter } from "@nestjs/core"

// Just setting this up for later.
@Injectable()
export class ExpressCustomLoader extends AbstractLoader {
  public register(admin: AdminJS, httpAdapter: AbstractHttpAdapter, options: AdminModuleOptions) {
    new ExpressLoader().register(admin, httpAdapter, options)
  }
}
