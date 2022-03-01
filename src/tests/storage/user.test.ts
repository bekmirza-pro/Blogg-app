import { IUser } from '../../models/User'
import { UserStorage } from '../../storage/mongo/user'
import Database from '../../core/db'

const storage = new UserStorage()

beforeAll(async () => {
    const db = new Database()
    db.connect()
})

describe('Checking storage.user', () => {
    const user = {
        _id: '8bf5fc5c-0558-408c-a12f-95dca952a56',
        name: {
            first_name: 'Jhon',
            last_name: 'Doe'
        },
        phone_number: 99002334,
        password: '11werty123',
        type: 'user',
        interested_categories: '988e0336-5471-429e-be47-b1831d105df5',
        photo: 'images-2325de1f-faaa-4c40-ae22-2d0f5ea93cfe.png'
    }

    const fake_id = '8bf5fc5c-0558-408c-a12f-95dca952a56'

    test('Create new user: succes', () => {
        return storage.create(user as IUser).then((data) => {
            expect(data._id).toEqual(user._id)
        })
    })

    test('Get all user: success', () => {
        return storage.find({}).then((data) => {
            expect(data.length > 0).toBeTruthy()
        })
    })

    test('Get one user: success', () => {
        return storage.findOne({ _id: user._id }).then((data) => {
            expect(data._id).toEqual(user._id)
        })
    })

    test('Get one user: fail', () => {
        return storage.findOne({ _id: fake_id }).catch((error) => {
            expect(error.statusCode).toEqual(404)
        })
    })

    test('Get update user: success', () => {
        const name = {
            first_name: 'Jhon',
            last_name: 'Doe'
        }

        return storage.update(user._id, { name } as IUser).then((data) => {
            expect(data._id).toEqual(user._id)
        })
    })

    test('Get update user: fail', () => {
        const name = {
            first_name: 'Jhon',
            last_name: 'Doe'
        }
        return storage.update(fake_id, { name } as IUser).catch((error) => {
            expect(error.statusCode).toEqual(404)
        })
    })

    test('Get delete user: succes', () => {
        return storage.delete(user._id).then((data) => {
            expect(data._id).toEqual(user._id)
        })
    })

    test('Get delete user: fail', () => {
        return storage.delete(fake_id).catch((error) => {
            expect(error.statusCode).toEqual(404)
        })
    })
})
