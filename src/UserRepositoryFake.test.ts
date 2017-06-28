import { deepEqual } from 'ptz-assert';
import { getByUserNameOrEmail, getOtherUsersWithSameUserNameOrEmail } from './UserRepositoryFake';

describe('UserRepositoryFake', () => {
    it('getOtherUsersWithSameUserNameOrEmail',  () => {
        const otherUsers =  getOtherUsersWithSameUserNameOrEmail(null);
        deepEqual(otherUsers, []);
    });

    it('getByUserNameOrEmail',  () => {
        // const userRepository = new UserRepositoryFake(null);
        const otherUsers =  getByUserNameOrEmail(null);
        deepEqual(otherUsers, null);
    });
});
