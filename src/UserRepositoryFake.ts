import { createRepository } from 'ptz-core-app';
import { IUser } from 'ptz-user-domain';

export let entities = [];
export const createUserRepoFake = () => {
    entities = [];
    const repo = createRepository('collectionFake', 'urlFake');
    return {
        collectionName: repo.collectionName,
        db: repo.db,
        save: repo.save,
        find: repo.find,
        getById: repo.getById,
        getByIds: repo.getByIds,
        getByUserNameOrEmail,
        getDbCollection: repo.getDbCollection,
        getOtherUsersWithSameUserNameOrEmail
    };
};

export const getOtherUsersWithSameUserNameOrEmail = (user: IUser): Promise<IUser[]> => {
    return Promise.resolve(entities);
};

export const getByUserNameOrEmail = (userNameOrEmail: string): Promise<IUser> => {
    return Promise.resolve(entities[0]);
};
