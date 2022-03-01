import { Router } from 'express'
import { UserController } from '../controllers/user'
import { UserValidator } from '../validators/user'
import multer from '../middleware/multer'
import { Middleware } from '../middleware/auth'

const router = Router({ mergeParams: true })
const controller = new UserController()
const validator = new UserValidator()
const middleware = new Middleware()

const upload = multer(['image/png', 'image/jpeg'], 10).single('photo')

router.route('/all').get(controller.getAll)
router.route('/register').post(upload, validator.create, controller.create)

router.route('/login').post(upload, validator.create, controller.login)
router
    .route('/:id')
    .get(middleware.auth(['admin']), controller.get)
    .get(middleware.auth(['admin']), controller.getAll)
    .patch(middleware.auth(['admin', 'user']), upload, validator.update, controller.update)
    .delete(middleware.auth(['admin', 'user']), controller.delete)

export default router
