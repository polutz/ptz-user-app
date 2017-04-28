import { equal } from 'ptz-assert';
import { UserRepositoryFake } from './UserRepositoryFake';
describe('UserRepositoryFake', () => {
    describe('getOtherUsersWithSameUserNameOrEmail', async () => {
        const userRepository = new UserRepositoryFake(null);
        const otherUsers = await userRepository.getOtherUsersWithSameUserNameOrEmail(null);
        equal(otherUsers, []);
    });
    describe('getByUserNameOrEmail', async () => {
        const userRepository = new UserRepositoryFake(null);
        const otherUsers = await userRepository.getByUserNameOrEmail(null);
        equal(otherUsers, []);
    });
});
//# sourceMappingURL=UserRepositoryFake.test.js.map