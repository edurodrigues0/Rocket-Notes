import { Router } from 'express'
import NotesController from '../controllers/notes-controller'

const notesRouter = Router()
const notesController = new NotesController()

notesRouter.post('/:user_id', notesController.create)

export default notesRouter