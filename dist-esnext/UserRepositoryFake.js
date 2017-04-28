import { BaseRepositoryFake } from 'ptz-core-app';
export class UserRepositoryFake extends BaseRepositoryFake {
    constructor(db) {
        super(db, 'users');
    }
    getOtherUsersWithSameUserNameOrEmail(user) {
        return Promise.resolve(this.entities);
    }
    getByUserNameOrEmail(userNameOrEmail) {
        return Promise.resolve(this.entities[0]);
    }
}
//# sourceMappingURL=UserRepositoryFake.js.map