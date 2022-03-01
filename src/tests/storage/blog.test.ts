import { IBlog } from '../../models/Blog'
import { BlogStorage } from '../../storage/mongo/blog'
import Database from '../../core/db'

const storage = new BlogStorage()

beforeAll(async () => {
    const db = new Database()
    await db.connect()
})

describe('Checking storage.blog', () => {
    const blog = {
        _id: 'f4d886cb-10a7-478f-afbe-c289dd3c2316',
        creator: 'a9617fc6-71c8-4a62-8d5b-d8b349037dec',
        category: '1598de11-5864-4f44-b6f0-994e847577c0',
        title: 'Friend',
        content: 'Hello my friends',
        images: ['images-2325de1f-faaa-4c40-ae22-2d0f5ea93cfe.png'],
        madeAt: 1645427395227
    }

    const fake_id = '8bf5fc5c-0558-408c-a12f-95dca952a56'

    test('Create new blog: succes', () => {
        return storage.create(blog as IBlog).then((data) => {
            expect(data._id).toEqual(blog._id)
        })
    })

    test('Get all blog: success', () => {
        return storage.find({}).then((data) => {
            expect(data.length > 0).toBeTruthy()
        })
    })

    test('Get one blog: success', () => {
        return storage.findOne({ _id: blog._id }).then((data) => {
            expect(data._id).toEqual(blog._id)
        })
    })

    test('Get one blog: fail', () => {
        return storage.findOne({ _id: fake_id }).catch((error) => {
            expect(error.statusCode).toEqual(404)
        })
    })

    test('Get update blog: success', () => {
        const title = 'Title updated'
        return storage.update(blog._id, { title } as IBlog).then((data) => {
            expect(data._id).toEqual(blog._id)
        })
    })

    test('Get update blog: fail', () => {
        const title = 'Title not updated'
        return storage.update(fake_id, { title } as IBlog).catch((error) => {
            expect(error.statusCode).toEqual(404)
        })
    })

    test('Get delete blog: succes', () => {
        return storage.delete(blog._id).then((data) => {
            expect(data._id).toEqual(blog._id)
        })
    })

    test('Get delete blog: fail', () => {
        return storage.delete(fake_id).catch((error) => {
            expect(error.statusCode).toEqual(404)
        })
    })
})
