import { Request, Response } from 'express'
import { AppError } from '../utils/errors/AppError'

class UsersController {
  create(request: Request, response: Response) {
    const { name, email, password } = request.body

    if(!name) {
      throw new AppError("Nome obrigatorio!");
    }

    response.status(201).json({ name, email, password })
  }
}

export default UsersController