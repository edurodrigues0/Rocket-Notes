import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('tags', (table) => {
    table.uuid('id').primary()
    table.text('name').notNullable()
    
    table.uuid('note_id').references('id').inTable('notes').onDelete('CASCADE')
    table.uuid('user_id').references('id').inTable('users')
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('tags')
}

