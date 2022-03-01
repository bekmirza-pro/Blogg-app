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
import Blog from '../models/Blog'

export class BlogController {
    getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { lang } = res.locals
        const { id } = req.params
        if (id) {
            req.query = {
                category: id
            }
        }

        const blogs = await storage.blog.find(req.query)

        res.status(200).json({
            success: true,
            data: {
                blogs
            },
            message: message('blog_getAll_200', lang)
        })
    })

    get = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const blog = await storage.blog.findOne({ _id: req.params.id })

        res.status(200).json({
            success: true,
            data: {
                blog
            }
        })
    })

    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        let photo
        await storage.category.update(req.body.category, { $inc: { total_blogs: 1 } })

        if (req.file) {
            photo = `images/${req.file.fieldname}-${uuidv4()}`

            await sharp(req.file.buffer)
                .png()
                .toFile(path.join(__dirname, '../../uploads', `${photo}.png`))
        }
        const blog = await storage.blog.create({
            ...req.body,
            creator: res.locals.id,
            images: `${photo}.png`
        })

        res.status(201).json({
            success: true,
            data: {
                blog
            }
        })
    })

    update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        let photo
        let blog

        if (req.file) {
            const blogs = await Blog.findById(req.params.id)

            if (`${blogs?.images}` !== 'undefined') {
                await unlink(path.join(__dirname, '../../uploads', `${blogs?.images}`))
            }

            photo = `images/${req.file.fieldname}-${uuidv4()}`

            await sharp(req.file.buffer)
                .png()
                .toFile(path.join(__dirname, '../../uploads', `${photo}.png`))

            blog = await storage.blog.update(req.params.id, {
                ...req.body,
                images: `${photo}.png`
            })
        } else {
            blog = await storage.blog.update(req.params.id, req.body)
        }

        res.status(200).json({
            success: true,
            data: {
                blog
            }
        })
    })

    delete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const blog = await Blog.findById(req.params.id)

        if (`${blog?.images}` !== 'undefined') {
            await unlink(path.join(__dirname, '../../uploads', `${blog?.images}`))
        }

        await storage.blog.delete(req.params.id)
        res.status(204).json({
            success: true,
            data: null
        })
    })
}
