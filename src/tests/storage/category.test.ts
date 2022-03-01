import { ICategory } from '../../models/Category'
import { CategoryStorage } from '../../storage/mongo/category'
import Database from '../../core/db'

const storage = new CategoryStorage()

beforeAll(async () => {
    const db = new Database()
    db.connect()
})

describe('Checking storage.category', () => {
    const category = {
        _id: '852aad8f-7993-451d-ba24-e982317b13b5',
        name: 'Name'
    }

    const fake_id = '8bf5fc5c-0558-408c-a12f-95dca952a56'

    test('Create new category: succes', () => {
        return storage.create(category as ICategory).then((data) => {
            expect(data._id).toEqual(category._id)
        })
    })

    test('Get all category: success', () => {
        return storage.find({}).then((data) => {
            expect(data.length > 0).toBeTruthy()
        })
    })

    test('Get one category: success', () => {
        return storage.findOne({ _id: category._id }).then((data) => {
            expect(data._id).toEqual(category._id)
        })
    })

    test('Get one category: fail', () => {
        return storage.findOne({ _id: fake_id }).catch((error) => {
            expect(error.statusCode).toEqual(404)
        })
    })

    test('Get update category: success', () => {
        const name = 'Name updated'
        return storage.update(category._id, { name } as ICategory).then((data) => {
            expect(data._id).toEqual(category._id)
        })
    })

    test('Get update category: fail', () => {
        const name = 'Name not updated'
        return storage.update(fake_id, { name } as ICategory).catch((error) => {
            expect(error.statusCode).toEqual(404)
        })
    })

    test('Get delete category: succes', () => {
        return storage.delete(category._id).then((data) => {
            expect(data._id).toEqual(category._id)
        })
    })

    test('Get delete category: fail', () => {
        return storage.delete(fake_id).catch((error) => {
            expect(error.statusCode).toEqual(404)
        })
    })
})
