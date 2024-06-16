import { Router } from 'express'
import * as AuthController from '../Controllers/AuthController'

const AuthRouter: Router = Router()

AuthRouter.post('/signup', AuthController.signup)

AuthRouter.post('/login', AuthController.login)

AuthRouter.post('/sociallogin', AuthController.Sociallogin)

export { AuthRouter }
