import { Request, Response } from 'express'
import { AppError } from '../utils/errors/AppError'
import { sqliteConnection } from '../database/sqlite';
import { compare, hash } from 'bcryptjs'
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
    const { name, email, password, old_password } = request.body
    const { id } = request.params

    const database = await sqliteConnection()
    const user = await database.get(
      'SELECT * FROM users WHERE id = (?)',
      [id]
    )

    if(!user) {
      throw new AppError('Usuário não encontrado!')
    }

    const userWithUpdatedEmail = await database.get(
      'SELECT * FROM users WHERE email = (?)',
      [email]
    )

    if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError('Este e-mail ja esta em uso')
    }

    user.name = name
    user.email = email

    if(password && !old_password) {
      throw new AppError('Voce precisa informar a senha antiga para definir a nova senha.')
    }

    if(password && old_password) {
      const checkOldPassword = await compare(old_password, user.password)

      if(!checkOldPassword) {
        throw new AppError('A senha antiga nao confere.')
      }

      user.password = await hash(password, 6)
    }

    await database.run(`
      UPDATE users SET 
      name = ?,
      email = ?,
      password = ?,
      updated_at = ?
      WHERE id = ?`,
      [user.name, user.email, user.password, new Date(), id]
    )

    return response.status(200).json()
  }
}

export default UsersController