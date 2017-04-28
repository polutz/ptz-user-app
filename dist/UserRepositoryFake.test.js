'use strict';

var _ptzAssert = require('ptz-assert');

var _UserRepositoryFake = require('./UserRepositoryFake');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

describe('UserRepositoryFake', function () {
    describe('getOtherUsersWithSameUserNameOrEmail', _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var userRepository, otherUsers;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        userRepository = new _UserRepositoryFake.UserRepositoryFake(null);
                        _context.next = 3;
                        return userRepository.getOtherUsersWithSameUserNameOrEmail(null);

                    case 3:
                        otherUsers = _context.sent;

                        (0, _ptzAssert.equal)(otherUsers, []);

                    case 5:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    })));
    describe('getByUserNameOrEmail', _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
        var userRepository, otherUsers;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        userRepository = new _UserRepositoryFake.UserRepositoryFake(null);
                        _context2.next = 3;
                        return userRepository.getByUserNameOrEmail(null);

                    case 3:
                        otherUsers = _context2.sent;

                        (0, _ptzAssert.equal)(otherUsers, []);

                    case 5:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    })));
});
//# sourceMappingURL=UserRepositoryFake.test.js.map
//# sourceMappingURL=UserRepositoryFake.test.js.map