import { Request, Response } from 'express'

class UsersController {
  create(request: Request, response: Response) {
    const { name, email, password } = request.body

    response.status(201).json({ name, email, password })
  }
}

export default UsersController