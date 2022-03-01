import { SampleStorage } from './mongo/sample'
import { AdminStorage } from './mongo/admin'
import { UserStorage } from './mongo/user'
import { CategoryStorage } from './mongo/category'
import { BlogStorage } from './mongo/blog'

interface IStorage {
    sample: SampleStorage
    admin: AdminStorage
    user: UserStorage
    category: CategoryStorage
    blog: BlogStorage
}

export let storage: IStorage = {
    sample: new SampleStorage(),
    admin: new AdminStorage(),
    user: new UserStorage(),
    category: new CategoryStorage(),
    blog: new BlogStorage()
}
