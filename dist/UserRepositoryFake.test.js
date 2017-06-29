'use strict';

var _ptzAssert = require('ptz-assert');

var _UserRepositoryFake = require('./UserRepositoryFake');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

describe('UserRepositoryFake', function () {
    it('getOtherUsersWithSameUserNameOrEmail', function () {
        var otherUsers = (0, _UserRepositoryFake.getOtherUsersWithSameUserNameOrEmail)(null);
        (0, _ptzAssert.deepEqual)(otherUsers, []);
    });
    it('getByUserNameOrEmail', _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var otherUsers;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return (0, _UserRepositoryFake.getByUserNameOrEmail)(null);

                    case 2:
                        otherUsers = _context.sent;

                        (0, _ptzAssert.equal)(otherUsers, null);

                    case 4:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    })));
});
//# sourceMappingURL=UserRepositoryFake.test.js.map
//# sourceMappingURL=UserRepositoryFake.test.js.map