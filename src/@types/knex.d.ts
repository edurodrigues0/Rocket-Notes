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
  }
}