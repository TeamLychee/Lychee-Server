import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import errorGenerator from '../../error/errorGenerator'
import message from '../modules/message'
import statusCode from '../modules/statusCode'
import { LoginDto } from '../DTOs/Auth/Requests/LoginDto'
import { getToken, getRefreshToken } from '../Middleware/jwtHandler'
import { signInKakao } from '../Middleware/socialAuth'
import { SignupDto } from '../DTOs/Auth/Requests/SignupDto'
import * as UserServiceUtils from '../Services/User/UserServiceUtils'
import config from '../config'

const prisma = new PrismaClient()

const login = async (loginDto: LoginDto) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: loginDto.email,
      },
    })

    if (!user || !user.password)
      throw errorGenerator({
        msg: message.NOT_FOUND_USER_EMAIL,
        statusCode: statusCode.NOT_FOUND,
      })

    const isMatch = await bcrypt.compare(loginDto.password, user.password)
    if (!isMatch)
      throw errorGenerator({
        msg: message.INVALID_PASSWORD,
        statusCode: statusCode.UNAUTHORIZED,
      })

    const data = {
      userId: user.id,
    }

    return data
  } catch (error) {
    throw error
  }
}

//* 소셜 로그인
const socialLogin = async (socialToken: string, socialPlatform: string) => {
  let email
  let name

  switch (socialPlatform) {
    case 'kakao':
      const userKakaoData = await signInKakao(socialToken)
      name = userKakaoData.profile_nickname
      email = userKakaoData.account_email //kakao_account.email
      break
  }

  if (email === undefined || email === null) {
    throw errorGenerator({
      msg: message.INVALID_EMAIL,
      statusCode: statusCode.UNAUTHORIZED,
    })
  }

  //* 기존 회원인지 확인
  const existingUser = await prisma.user.findFirst({
    where: {
      email: email,
    },
  })

  //미등록 유저
  if (!existingUser) {
    const refreshToken = getRefreshToken()
    const Id = await UserServiceUtils.createUserId()
    const userC = await UserServiceUtils.createColor()

    const createUser = await prisma.user.create({
      data: {
        email: email,
        refreshToken: refreshToken,
        userColor: userC,
        groupId: config.defaultGroupId,
        id: Id,
        userName: name,
        // birth: ' ',
        // sex: ' ',
        // password: ' ',
        // fcmToken: ' ',
      },
    })

    return {
      userId: createUser.id,
    }
  }

  //* 기존에 회원이 등록되어있으면, 자동 로그인
  const refreshToken = getRefreshToken()

  await prisma.user.update({
    data: {
      refreshToken: refreshToken,
    },
    where: {
      email: email,
    },
  })

  return {
    userId: existingUser.id,
  }
}

export { login, socialLogin }
