import { Router } from 'express'
import NotesController from '../controllers/notes-controller'
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated'

const notesRouter = Router()
const notesController = new NotesController()

notesRouter.use(ensureAuthenticated)

notesRouter.post('/', notesController.create)
notesRouter.get('/:id', notesController.show)
notesRouter.delete('/:id', notesController.delete)
notesRouter.get('/', notesController.index)

export default notesRouter