import { Router } from 'express'
//import { body } from 'express-validator/check';
import * as AuthController from '../Controllers/AuthController'
import { signInKakao } from '../Middleware/socialAuth'

const AuthRouter: Router = Router()

AuthRouter.post('/signup', AuthController.signup)

AuthRouter.post('/login', AuthController.login)

AuthRouter.post('/sociallogin', signInKakao, AuthController.Sociallogin)

export { AuthRouter }
