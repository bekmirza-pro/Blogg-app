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

export class CategoryController {
    getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang, id, role } = res.locals
        const categorys = await storage.category.find(req.query)

        res.status(200).json({
            success: true,
            data: {
                categorys
            },
            message: message('category_getAll_200', lang)
        })
    })

    get = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const category = await storage.category.findOne({ _id: req.params.id })

        res.status(200).json({
            success: true,
            data: {
                category
            }
        })
    })

    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const category = await storage.category.create({ ...req.body, creator: res.locals.id })

        res.status(201).json({
            success: true,
            data: {
                category
            }
        })
    })

    update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const category = await storage.category.update(req.params.id, req.body)

        res.status(200).json({
            success: true,
            data: {
                category
            }
        })
    })

    delete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const category = await storage.category.findOne(req.body.category)
        if (category.total_blogs == 0) {
            await storage.category.delete(req.params.id)
            res.status(204).json({
                success: true,
                data: null
            })
        } else {
            res.status(400).json({
                success: false,
                data: null
            })
        }
    })
}
