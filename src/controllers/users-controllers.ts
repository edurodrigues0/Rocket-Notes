import { Request, Response } from 'express'
import { AppError } from '../utils/errors/AppError'
import { sqliteConnection } from '../database/sqlite';
import { hash } from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'

class UsersController {
  async create(request: Request, response: Response) {
    const { name, email, password } = request.body

    const database = await sqliteConnection()
    const checkUserExists = await database.get(
      'SELECT * FROM users WHERE email = (?)',
      [email]
    )

    if(checkUserExists) {
      throw new AppError('E-mail já está em uso.')
    }

    const id = uuidv4()
    const hashedPassword = await hash(password, 6);

    await database.run(
      'INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)',
      [id, name, email, hashedPassword]
    )

    response.status(201).json()
  }
}

export default UsersController