import { Knex, knex as setupKnex } from 'knex'
import { env } from './env'

export const config: Knex.Config = {
  client: env.DATABASE_CLIENT,
  connection: env.DATABASE_CLIENT === 'sqlite' 
    ? { 
        filename: env.DATABASE_URL 
      } 
    : env.DATABASE_URL,
  useNullAsDefault: true,
  pool: {
    afterCreate: (conn: any, cb: any) => {
      conn.run('PRAGMA foreign_keys = ON', cb)
    }
  },
  migrations: {
    extension: 'ts',
    directory: './src/database/knex/migrations',
  },
}

export const knex = setupKnex(config)