import { NextFunction, Request, Response } from 'express'
import AppError from '../utils/appError'
import catchAsync from '../utils/catchAsync'
import jwt from 'jsonwebtoken'
import config from '../config/config'

type DecodedToken = {
    id: string
    role: string
}

export const signToken = async (id: string, role: string): Promise<string> => {
    return jwt.sign({ id, role }, config.JwtSecret)
}

export const decodeToken = async (token: string): Promise<DecodedToken> => {
    const decoded = jwt.verify(token, config.JwtSecret) as DecodedToken
    return decoded
}

export class Middleware {
    auth = (roles: string[]) => {
        return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
            const token = req.headers.authorization

            if (!token) {
                return next(new AppError(401, 'auth_401'))
            }

            const decoded = decodeToken(token)
            const role = (await decoded).role

            if (!roles.includes(role)) {
                return next(new AppError(401, 'auth_401'))
            }

            res.locals.id = (await decoded).id
            res.locals.role = (await decoded).role

            next()
        })
    }
}
