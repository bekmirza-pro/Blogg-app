import { IAdmin } from '../../models/Admin'
import { AdminStorage } from '../../storage/mongo/admin'
import Database from '../../core/db'

const storage = new AdminStorage()

beforeAll(async () => {
    const db = new Database()
    await db.connect()
})

describe('Checking storage.admin', () => {
    const admin = {
        _id: '38b8acbf-c1db-4341-a2fd-2302ba977d6c',
        name: {
            first_name: 'Jhony',
            last_name: 'Doee'
        },
        phone_number: 9900712221,
        password: '123rt1y',
        type: 'admin',
        photo: 'images-2325de1f-faaa-4c40-ae22-2d0f5ea93cfe.png'
    }

    const fake_id = 'dace8ae9-bb96-4738-b44a-fe4b485c8dbd'

    test('Create new admin: succes', () => {
        return storage.create(admin as IAdmin).then((data) => {
            expect(data._id).toEqual(admin._id)
        })
    })

    test('Get all admin: success', () => {
        return storage.find({}).then((data) => {
            expect(data.length > 0).toBeTruthy()
        })
    })

    test('Get one admin: success', () => {
        return storage.findOne({ _id: admin._id }).then((data) => {
            expect(data._id).toEqual(admin._id)
        })
    })

    test('Get one admin: fail', () => {
        return storage.findOne({ _id: fake_id }).catch((error) => {
            expect(error.statusCode).toEqual(404)
        })
    })

    test('Get update admin: success', () => {
        const first_name = 'first_name updated'
        const last_name = 'last_name updated'

        return storage
            .update(admin._id, {
                name: {
                    first_name: first_name,
                    last_name: last_name
                }
            } as IAdmin)
            .then((data) => {
                expect(data._id).toEqual(admin._id)
            })
    })

    test('Get update admin: fail', () => {
        const first_name = 'first_name not updated'
        const last_name = 'last_name not updated'

        return storage
            .update(fake_id, {
                name: {
                    first_name: first_name,
                    last_name: last_name
                }
            } as IAdmin)
            .catch((error) => {
                expect(error.statusCode).toEqual(404)
            })
    })

    test('Get delete admin: succes', () => {
        return storage.delete(admin._id).then((data) => {
            expect(data._id).toEqual(admin._id)
        })
    })

    test('Get delete admin: fail', () => {
        return storage.delete(fake_id).catch((error) => {
            expect(error.statusCode).toEqual(404)
        })
    })
})
