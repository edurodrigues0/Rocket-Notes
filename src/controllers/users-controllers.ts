import { Request, Response } from 'express'
import { AppError } from '../utils/errors/AppError'
import { compare, hash } from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'
import { knex } from '../database'

class UsersController {
  async create(request: Request, response: Response) {
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.string(),
      password: z.string(),
    })

    const { name, email, password } = createUserBodySchema.parse(request.body)

    const checkUserExists = await knex('users').where('email', email).first()

    if(checkUserExists) {
      throw new AppError('E-mail já está em uso.', 409)
    }

    const id = uuidv4()
    const hashedPassword = await hash(password, 6);

    await knex('users').insert({
      id,
      name,
      email,
      password: hashedPassword,
    })

    response.status(201).json()
  }

  async update(request: Request, response: Response) {
    const updateUserBodySchema = z.object({
      name: z.string().optional(),
      email: z.string().optional(),
      password: z.string().optional(),
      old_password: z.string().optional(),
      avatar: z.string().optional()
    })

    const { id } = request.user


    const { 
      name, 
      email, 
      password, 
      old_password, 
      avatar 
    } = updateUserBodySchema.parse(request.body)

    const user = await knex('users').where('id', id).first()

    if(!user) {
      throw new AppError('Usuário não encontrado!')
    }

    const userWithUpdatedEmail = await knex('users')
    .where('email', email)
    .first()

    if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError('Este e-mail ja esta em uso')
    }

    user.name = name ?? user.name
    user.email = email ?? user.email
    user.avatar = avatar ?? user.avatar

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

    await knex('users').where('id', id).update({
      id,
      name,
      email,
      password,
      avatar
    })

    return response.status(200).json()
  }
}

export default UsersController