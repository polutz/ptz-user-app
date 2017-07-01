import { deepEqual, equal } from 'ptz-assert';
import { getByUserNameOrEmail, getOtherUsersWithSameUserNameOrEmail } from './UserRepositoryFake';
describe('UserRepositoryFake', () => {
    it('getOtherUsersWithSameUserNameOrEmail', () => {
        const otherUsers = getOtherUsersWithSameUserNameOrEmail(null);
        deepEqual(otherUsers, []);
    });
    it('getByUserNameOrEmail', async () => {
        const otherUsers = await getByUserNameOrEmail(null);
        equal(otherUsers, null);
    });
});
//# sourceMappingURL=UserRepositoryFake.test.js.map