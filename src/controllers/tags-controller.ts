import { Request, Response } from "express"
import { knex } from "../database"
import { z } from "zod"
import { AppError } from "../utils/errors/AppError"


class TagsController {
  async index(request: Request, response: Response) {
    const user_id = request.user.id

    const user = await knex("users").where({ id: user_id }).first()

    if (!user) {
      throw new AppError("Usuário não encontrado.", 404)
    }

    const tags = await knex("tags")
    .where({ user_id })

    return response.json(tags)
  }
}

export default TagsController