import { createRepository } from 'ptz-core-app';
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
export const getOtherUsersWithSameUserNameOrEmail = (user) => {
    return Promise.resolve(entities);
};
export const getByUserNameOrEmail = (userNameOrEmail) => {
    return Promise.resolve(entities[0]);
};
//# sourceMappingURL=UserRepositoryFake.js.map