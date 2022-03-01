import { Router } from 'express'
import { SampleController } from '../controllers/sample'
import { SampleValidator } from '../validators/sample'
import multer from '../middleware/multer'
import { Middleware } from '../middleware/auth'

const router = Router({ mergeParams: true })
const controller = new SampleController()
const validator = new SampleValidator()
const middleware = new Middleware()
const upload = multer(['images/png', 'images/jpeg'], 20).fields([
    {
        name: 'image',
        maxCount: 1
    }
])

router.route('/all').get(controller.getAll)
router
    .route('/create')
    .post(middleware.auth(['admin']), upload, validator.create, controller.create)
router
    .route('/:id')
    .get(controller.get)
    .patch(middleware.auth(['admin']), upload, validator.update, controller.update)
    .delete(controller.delete)

export default router
