// eslint-disable-next-line
import { Knex } from 'knex'

declare module "knex/types/tables" {
  export interface Tables {
    notes: {
      id: string
      title: string
      description: string
      user_id: string
      created_at: string
      updated_at: string
    };

    tags: {
      id: string
      name: string
      note_id: string
      user_id: string
    }

    links: {
      id: string
      note_id: string
      url: string
      created_at: string
    }

    users: {
      id: string
      name: string
      email: string
      password: string
      avatar: string
      created_at: string
      updated_at: string
    };
  }
}