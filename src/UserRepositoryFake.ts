// import {  } from '@alanmarcell/ptz-core-app';
import { IUser } from '@alanmarcell/ptz-user-domain';

const entities = [];

export const getOtherUsersWithSameUserNameOrEmail = (user: IUser) => {
    return entities;
};

export const getByUserNameOrEmail = (userNameOrEmail: string) => {
    return entities[0];
};

// export class UserRepositoryFake extends BaseRepositoryFake implements IUserRepository {

//     constructor(db) {
//         super(db, 'users');
//     }

//     getOtherUsersWithSameUserNameOrEmail(user: IUser): Promise<IUser[]> {
//         return Promise.resolve(this.entities);
//     }

//     getByUserNameOrEmail(userNameOrEmail: string): Promise<IUser> {
//         return Promise.resolve(this.entities[0]);
//     }
// }
