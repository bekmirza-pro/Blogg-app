import { IBlog } from '../../models/Blog'

export interface IBlogAllResponse {
    payloads: IBlog[]
    count: number
}

export interface BlogRepo {
    find(query: Object): Promise<IBlog[]>
    findOne(query: Object): Promise<IBlog>
    create(payload: IBlog): Promise<IBlog>
    update(id: string, payload: IBlog): Promise<IBlog>
    updateMany(id: string, payload: Object): Promise<Object>
    delete(id: string): Promise<IBlog>
}
