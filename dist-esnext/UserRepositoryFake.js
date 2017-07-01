import { createRepository } from '@alanmarcell/ptz-core-app';
export let entities = [];
export const createUserRepoFake = () => {
    entities = [];
    const repo = createRepository('collectionFake', 'urlFake');
    // tslint:disable-next-line:no-string-literal
    repo['getByUserNameOrEmail'] = getByUserNameOrEmail;
    // tslint:disable-next-line:no-string-literal
    repo['getOtherUsersWithSameUserNameOrEmail'] = getOtherUsersWithSameUserNameOrEmail;
    return repo;
};
export const getOtherUsersWithSameUserNameOrEmail = (user) => {
    return Promise.resolve(entities);
};
export const getByUserNameOrEmail = (userNameOrEmail) => {
    return Promise.resolve(entities[0]);
};
//# sourceMappingURL=UserRepositoryFake.js.map