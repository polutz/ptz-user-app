'use strict';

var _ptzAssert = require('ptz-assert');

var _UserRepositoryFake = require('./UserRepositoryFake');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

describe('UserRepositoryFake', () => {
    it('getOtherUsersWithSameUserNameOrEmail', () => {
        const otherUsers = (0, _UserRepositoryFake.getOtherUsersWithSameUserNameOrEmail)(null);
        (0, _ptzAssert.deepEqual)(otherUsers, []);
    });
    it('getByUserNameOrEmail', _asyncToGenerator(function* () {
        const otherUsers = yield (0, _UserRepositoryFake.getByUserNameOrEmail)(null);
        (0, _ptzAssert.equal)(otherUsers, null);
    }));
});
//# sourceMappingURL=UserRepositoryFake.test.js.map
//# sourceMappingURL=UserRepositoryFake.test.js.map