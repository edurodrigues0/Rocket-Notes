import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'path'

export async function sqliteConnection() {
  return open({
    filename: path.resolve(__dirname, '..', 'database.db'),
    driver: sqlite3.Database
  })
}