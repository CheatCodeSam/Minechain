import { AdminModuleFactory, AdminModuleOptions } from "@adminjs/nestjs"
import * as AdminJSTypeorm from "@adminjs/typeorm"
import AdminJS from "adminjs"
import { Repository } from "typeorm"

import { DynamicModule, Inject, Module, OnModuleInit } from "@nestjs/common"
import { HttpAdapterHost } from "@nestjs/core"
import { InjectRepository, TypeOrmModule } from "@nestjs/typeorm"

import { Session } from "../auth/session.entity"
import { Token } from "../blockchain/token.entity"
import { User } from "../users/entities/user.entity"
import { CONFIG_TOKEN } from "./config.token"
import { register } from "./express.loader"

AdminJS.registerAdapter({
  Resource: AdminJSTypeorm.Resource,
  Database: AdminJSTypeorm.Database
})

@Module({
  imports: [TypeOrmModule.forFeature([User, Token, Session])]
})
export class CustomAdminJsModule implements OnModuleInit {
  constructor(
    @InjectRepository(Session) private sessionRepo: Repository<Session>,
    private readonly httpAdapterHost: HttpAdapterHost,
    @Inject(CONFIG_TOKEN) private readonly adminModuleOptions: AdminModuleOptions
  ) {}

  public static createAdmin(options: AdminModuleOptions): DynamicModule {
    return {
      module: CustomAdminJsModule,
      providers: [
        {
          provide: CONFIG_TOKEN,
          useValue: options
        }
      ]
    }
  }

  public static createAdminAsync(options: AdminModuleFactory): DynamicModule {
    return {
      imports: options.imports,
      module: CustomAdminJsModule,
      providers: [
        {
          provide: CONFIG_TOKEN,
          useFactory: options.useFactory,
          inject: options.inject
        }
      ]
    }
  }

  async onModuleInit() {
    if (
      "shouldBeInitialized" in this.adminModuleOptions &&
      !this.adminModuleOptions.shouldBeInitialized
    ) {
      return
    }

    const admin = new AdminJS(this.adminModuleOptions.adminJsOptions)
    const { httpAdapter } = this.httpAdapterHost

    register(admin, this.sessionRepo, httpAdapter, {
      ...this.adminModuleOptions,
      adminJsOptions: admin.options
    })
  }
}
