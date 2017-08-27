'use strict';

var _ptzAssert = require('ptz-assert');

var _UserRepositoryFake = require('./UserRepositoryFake');

describe('UserRepositoryFake', () => {
    it('getOtherUsersWithSameUserNameOrEmail', () => {
        const otherUsers = (0, _UserRepositoryFake.getOtherUsersWithSameUserNameOrEmail)(null);
        (0, _ptzAssert.deepEqual)(otherUsers, []);
    });
    it('getByUserNameOrEmail', async () => {
        const otherUsers = await (0, _UserRepositoryFake.getByUserNameOrEmail)(null);
        (0, _ptzAssert.equal)(otherUsers, null);
    });
});
//# sourceMappingURL=UserRepositoryFake.test.js.map
//# sourceMappingURL=UserRepositoryFake.test.js.map