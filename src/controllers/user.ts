import { NextFunction, Request, Response } from 'express'
import { logger } from '../config/logger'
import { storage } from '../storage/main'
import AppError from '../utils/appError'
import catchAsync from '../utils/catchAsync'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import sharp from 'sharp'
import { unlink } from 'fs/promises'
import { message } from '../locales/get_message'
import { signToken } from '../middleware/auth'
import User from '../models/User'
const { hashSync, compareSync } = require('bcrypt')

export class UserController {
    getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang, id, role } = res.locals
        const users = await storage.user.find(req.body)

        res.status(200).json({
            success: true,
            data: {
                users
            },
            message: message('user_getAll_200', lang)
        })
    })

    get = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const user = await storage.user.findOne({ _id: req.params.id })

        res.status(200).json({
            success: true,
            data: {
                user
            }
        })
    })

    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { password } = req.body

        if (password) req.body.password = await hashSync(password, 10)

        let photo
        if (req.file) {
            photo = `images/${req.file.fieldname}-${uuidv4()}`

            await sharp(req.file.buffer)
                .png()
                .toFile(path.join(__dirname, '../../uploads', `${photo}.png`))
        }

        const user = await storage.user.create({ ...req.body, photo: `${photo}.png` })

        const token = await signToken(user.id, user.type)
        res.status(201).json({
            success: true,
            data: {
                user,
                token
            }
        })
    })

    login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const user = await storage.user.findOne({ phone_number: req.body.phone_number })

        const isValidPassword = compareSync(req.body.password, user.password)

        if (!isValidPassword) return next(new AppError(401, 'Invalid password'))

        if (!user) {
            return next(new AppError(404, 'User not found !!!'))
        }

        const token = await signToken(user.id, user.type)

        res.status(201).json({
            success: true,
            data: {
                user,
                token
            }
        })
    })

    update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        let photo
        let user

        if (req.file) {
            const users = await User.findById(req.params.id)

            if (`${users?.photo}` !== 'undefined') {
                await unlink(path.join(__dirname, '../../uploads', `${users?.photo}`))
            }
            photo = `images/${req.file.fieldname}-${uuidv4()}`

            await sharp(req.file.buffer)
                .png()
                .toFile(path.join(__dirname, '../../uploads', `${photo}.png`))

            user = await storage.user.update(req.params.id, {
                ...req.body,
                photo: `${photo}.png`
            })
        } else {
            user = await storage.user.update(req.params.id, req.body)
        }

        res.status(200).json({
            success: true,
            data: {
                user
            }
        })
    })

    delete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const user = await User.findById(req.params.id)

        if (`${user?.photo}` !== 'undefined') {
            await unlink(path.join(__dirname, '../../uploads', `${user?.photo}`))
        }

        await storage.user.delete(req.params.id)
        res.status(204).json({
            success: true,
            data: null
        })
    })
}
