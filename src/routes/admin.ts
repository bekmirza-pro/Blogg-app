import { Router } from 'express'
import { AdminController } from '../controllers/admin'
import { AdminValidator } from '../validators/admin'
import multer from '../middleware/multer'
import { Middleware } from '../middleware/auth'

const router = Router({ mergeParams: true })
const controller = new AdminController()
const validator = new AdminValidator()
const middleware = new Middleware()

const upload = multer(['image/png', 'image/jpeg'], 10).single('photo')

router.route('/all').get(middleware.auth(['admin']), controller.getAll)
router
    .route('/create')
    .post(middleware.auth(['admin']), upload, validator.create, controller.create)

router.route('/login').post(upload, validator.create, controller.login)
router
    .route('/:id')
    .get(middleware.auth(['admin']), controller.get)
    .patch(middleware.auth(['admin']), upload, validator.update, controller.update)
    .delete(middleware.auth(['admin']), controller.delete)

export default router
