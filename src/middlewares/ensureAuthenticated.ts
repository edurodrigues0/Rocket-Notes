import { JsonWebTokenError, verify } from "jsonwebtoken"
import { AppError } from "../utils/errors/AppError"
import { auth } from "../configs/auth"
import { Response, Request, NextFunction } from "express"

export function ensureAuthenticated(
  request: Request, 
  response: Response, 
  next: NextFunction
) {
  const authHeader = request.headers.authorization

  if (!authHeader || typeof authHeader !== "string") {
    throw new AppError("JWT Token inválido", 401);
  }

  const [_, token] = authHeader.split(" ")

  try {
    const { sub: user_id } = verify(token, auth.jwt.secret) 

    if (!user_id || typeof user_id !== 'string') {
      throw new AppError("JWT Token inválido", 401)
    }

    request.user = {
      id: user_id
    }

    return next()
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      throw new AppError("JWT Token inválido", 401)
    } else {
      throw new AppError("Erro ao verificar JWT Token", 500);
    }
  }
}