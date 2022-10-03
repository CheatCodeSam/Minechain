/* eslint-disable no-underscore-dangle */
import { AdminModuleOptions } from "@adminjs/nestjs"
import AdminJS, { Router as AdminRouter } from "adminjs"
import { TypeormStore } from "connect-typeorm/out"
import { Repository } from "typeorm"

import { loadPackage } from "@nestjs/common/utils/load-package.util"
import { AbstractHttpAdapter } from "@nestjs/core"

import { Session } from "../auth/session.entity"
import { User } from "../users/entities/user.entity"

import express = require("express")
import session = require("express-session")

export const register = async (
  admin: AdminJS,
  sessionRepo: Repository<Session>,
  userRepo: Repository<User>,
  httpAdapter: AbstractHttpAdapter,
  options: AdminModuleOptions
) => {
  const app = httpAdapter.getInstance()

  loadPackage("express", "@adminjs/nestjs")
  const adminJsExpressjs = loadPackage("@adminjs/express", "@adminjs/nestjs", () =>
    require("@adminjs/express")
  )
  loadPackage("express-formidable", "@adminjs/nestjs")

  loadPackage("express-session", "@adminjs/nestjs")

  const { routes, assets } = AdminRouter
  let router = express.Router()

  router.use(
    session({
      name: "NESTJS_SESSION_ID",
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: new TypeormStore().connect(sessionRepo)
    })
  )

  const authorizedRoutesMiddleware: express.RequestHandler = async (request, response, next) => {
    const session = request.session as any

    if (request.session) {
      if (session.passport?.user?.id) {
        const id = session.passport.user.id
        const user = await userRepo.findOne({ where: { id } })
        if (user?.isSuperUser) {
          if (!session.adminUser) {
            session.adminUser = { email: user.fullName }
            request.session.save()
          }
          return next()
        }
      } else {
        return response.redirect("/")
      }
    } else return response.redirect("/login")
  }

  router.use(authorizedRoutesMiddleware)

  router = adminJsExpressjs.buildRouter(admin, router, options.formidableOptions)

  // This named function is there on purpose.
  // It names layer in main router with the name of the function, which helps localize
  // admin layer in reorderRoutes() step.
  app.use(options.adminJsOptions.rootPath, function admin(req, res, next) {
    return router(req, res, next)
  })
  reorderRoutes(app)
}

const reorderRoutes = (app) => {
  let jsonParser = []
  let urlencodedParser = []
  let admin = []

  // Nestjs uses bodyParser under the hood which is in conflict with adminjs setup.
  // Due to adminjs-expressjs usage of formidable we have to move body parser in layer tree after adminjs init.
  // Notice! This is not documented feature of express, so this may change in the future. We have to keep an eye on it.
  if (app && app._router && app._router.stack) {
    const jsonParserIndex = app._router.stack.findIndex(
      (layer: { name: string }) => layer.name === "jsonParser"
    )
    if (jsonParserIndex >= 0) {
      jsonParser = app._router.stack.splice(jsonParserIndex, 1)
    }

    const urlencodedParserIndex = app._router.stack.findIndex(
      (layer: { name: string }) => layer.name === "urlencodedParser"
    )
    if (urlencodedParserIndex >= 0) {
      urlencodedParser = app._router.stack.splice(urlencodedParserIndex, 1)
    }

    const adminIndex = app._router.stack.findIndex(
      (layer: { name: string }) => layer.name === "admin"
    )
    if (adminIndex >= 0) {
      admin = app._router.stack.splice(adminIndex, 1)
    }

    // if adminjs-nestjs didn't reorder the middleware
    // the body parser would have come after corsMiddleware
    const corsIndex = app._router.stack.findIndex(
      (layer: { name: string }) => layer.name === "corsMiddleware"
    )

    // in other case if there is no corsIndex we go after expressInit, because right after that
    // there are nest endpoints.
    const expressInitIndex = app._router.stack.findIndex(
      (layer: { name: string }) => layer.name === "expressInit"
    )

    const initIndex = (corsIndex >= 0 ? corsIndex : expressInitIndex) + 1

    app._router.stack.splice(initIndex, 0, ...admin, ...jsonParser, ...urlencodedParser)
  }
}
