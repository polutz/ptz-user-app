import { BaseRepositoryFake } from 'ptz-core-app';
import { IUser, IUserRepository } from 'ptz-user-domain';

export class UserRepositoryFake extends BaseRepositoryFake implements IUserRepository {

    constructor(db) {
        super(db, 'users');
    }

    getOtherUsersWithSameUserNameOrEmail(user: IUser): Promise<IUser[]> {
        return Promise.resolve(this.entities);
    }

    getByUserNameOrEmail(userNameOrEmail: string): Promise<IUser> {
        return Promise.resolve(this.entities[0]);
    }
}
