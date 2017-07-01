import { createRepository } from '@alanmarcell/ptz-core-app';
import { IUser } from '@alanmarcell/ptz-user-domain';

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

export const getOtherUsersWithSameUserNameOrEmail = (user: IUser): Promise<IUser[]> => {
    return Promise.resolve(entities);
};

export const getByUserNameOrEmail = (userNameOrEmail: string): Promise<IUser> => {
    return Promise.resolve(entities[0]);
};
