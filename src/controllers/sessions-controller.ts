import { Request, Response } from "express"

import { knex } from "../database"
import { compare } from "bcryptjs"
import { sign } from "jsonwebtoken"
import { AppError } from "../utils/errors/AppError"
import { auth } from "../configs/auth"

class SessionsController {
  async create(request: Request, response: Response) {
    const { email, password } = request.body

    const user = await knex("users").where({ email }).first()

    if (!user) {
      throw new AppError("E-mail e/ou senha incorreta", 401)
    }

    const passwordMatched = await compare(password, user.password)

    if (!passwordMatched) {
      throw new AppError("E-mail e/ou senha incorreta", 401)
    }

    const { expiresIn, secret } = auth.jwt
    const token = sign({}, secret, {
      subject: String(user.id),
      expiresIn,
    })

    return response.json({ user, token })
  }
}

export default SessionsController