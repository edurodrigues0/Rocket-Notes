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

  async update(request: Request, response: Response) {
    const { name, email } = request.body
    const { id } = request.params

    const database = await sqliteConnection()
    const user = await database.get(
      'SELECT * FROM users WHERE id = (?)',
      [id]
    )

    if (!user) {
      throw new AppError('Usuário não encontrado!')
    }

    const userWithUpdatedEmail = await database.get(
      'SELECT * FROM users WHERE email = (?)',
      [email]
    )

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError('Este e-mail ja esta em uso')
    }

    user.name = name
    user.email = email

    await database.run(`
      UPDATE users SET 
      name = ?,
      email = ?,
      updated_at = ?
      WHERE id = ?`,
      [user.name, user.email, new Date(), id]
    )

    return response.status(200).json()
  }
}

export default UsersController