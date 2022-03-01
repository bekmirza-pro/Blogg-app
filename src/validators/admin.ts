import Joi from 'joi'
import { NextFunction, Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'

export class AdminValidator {
    keys = {
        required: 'required',
        optional: 'optional'
    }

    createSchema = Joi.object({
        name: {
            first_name: Joi.string().required(),
            last_name: Joi.string().required()
        },
        phone_number: Joi.number().integer().required(),
        password: Joi.string().required(),
        type: Joi.string(),
        photo: Joi.string()
    })

    updateSchema = Joi.object({
        name: {
            first_name: Joi.string(),
            last_name: Joi.string()
        },
        phone_number: Joi.number().required(),
        password: Joi.string().required(),
        photo: Joi.string()
    })

    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { name } = req.body

        if (name) {
            req.body.name = JSON.parse(name)
        }

        const { error } = this.createSchema.validate(req.body)

        if (error) return next(error)

        next()
    })

    update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { name } = req.body

        if (name) {
            req.body.name = JSON.parse(name)
        }

        const { error } = this.updateSchema.validate(req.body)
        if (error) return next(error)

        next()
    })
}
