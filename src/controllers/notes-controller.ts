import { z } from 'zod'
import { knex } from '../database'
import { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'

class NotesController {
  async create(request: Request, response: Response) {
    const createNotesBodySchema = z.object({
      title: z.string(),
      description: z.string().optional(),
      tags: z.string().array(),
      links: z.string().array()
    })

    const createNotesParamsSchema = z.object({
      user_id: z.string(),
    })

    const { 
      title, 
      description, 
      tags, 
      links 
    } = createNotesBodySchema.parse(request.body)
    const { user_id } = createNotesParamsSchema.parse(request.params)

    const id = uuidv4()

    await knex('notes').insert({
      id,
      title,
      description,
      user_id
    });

    const linksInsert = links.map((link: string) => {
      return {
        id: uuidv4(),
        note_id: id,
        url: link
      }
    })

    await knex('links').insert(linksInsert)

    const tagsInsert = tags.map((name: string) => {
      return {
        id: uuidv4(),
        note_id: id,
        user_id,
        name
      }
    })

    await knex('tags').insert(tagsInsert)

    response.json();
  }
}

export default NotesController