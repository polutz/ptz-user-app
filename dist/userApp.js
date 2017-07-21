'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.deleteUser = exports.updatePasswordToken = exports.updatePassword = exports.seed = exports.verifyAuthToken = exports.getAuthToken = exports.authUser = exports.findUsers = exports.saveUser = exports.hashPassword = exports.createApp = exports.pDecode = exports.pEcode = exports.pHash = exports.passwordSalt = exports.tokenSecret = undefined;

var _ptzUserDomain = require('@alanmarcell/ptz-user-domain');

var _bcryptjs = require('bcryptjs');

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _jwtSimple = require('jwt-simple');

var _ptzValidations = require('ptz-validations');

var V = _interopRequireWildcard(_ptzValidations);

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
// import { log } from 'ptz-log';


_dotenv2.default.config();
var tokenSecret = exports.tokenSecret = process.env.PASSWORD_SALT;
var passwordSalt = exports.passwordSalt = process.env.PASSWORD_SALT;
var pHash = exports.pHash = _ramda2.default.curry(function (secret) {
    return function (user) {
        return (0, _bcryptjs.hash)(user, secret);
    };
});
var pEcode = exports.pEcode = _ramda2.default.curry(function (secret) {
    return function (user) {
        return (0, _jwtSimple.encode)(user, secret);
    };
});
var pDecode = exports.pDecode = _ramda2.default.curry(function (secret) {
    return function (user) {
        return (0, _jwtSimple.decode)(user, secret);
    };
});
var createApp = exports.createApp = function createApp(userAppArgs) {
    var userRepository = userAppArgs.userRepository;
    return {
        saveUser: saveUser({
            userRepository: userRepository,
            hashPass: hashPassword(pHash(tokenSecret)),
            createUser: _ptzUserDomain.createUser,
            isValid: V.isValid,
            updateUser: _ptzUserDomain.updateUser,
            otherUsersWithSameUserNameOrEmail: _ptzUserDomain.otherUsersWithSameUserNameOrEmail
        }),
        findUsers: findUsers(userRepository.find),
        authUser: authUser(userRepository.getByUserNameOrEmail),
        getAuthToken: getAuthToken({
            authUserForm: _ptzUserDomain.authUserForm,
            authUser: authUser(userRepository.getByUserNameOrEmail),
            encode: pEcode(tokenSecret)
        }),
        verifyAuthToken: verifyAuthToken(pDecode(tokenSecret)),
        updatePassword: updatePassword,
        updatePasswordToken: updatePasswordToken,
        deleteUser: deleteUser,
        hashPassword: hashPassword(pHash(tokenSecret)),
        seed: seed(userRepository)
    };
};
var hashPassword = exports.hashPassword = _ramda2.default.curry(function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(hashArg, user) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        if (user.password) {
                            _context.next = 2;
                            break;
                        }

                        return _context.abrupt('return', Promise.resolve(user));

                    case 2:
                        _context.next = 4;
                        return hashArg(user.password);

                    case 4:
                        user.passwordHash = _context.sent;

                        user.password = undefined;
                        return _context.abrupt('return', Promise.resolve(user));

                    case 7:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function (_x, _x2) {
        return _ref.apply(this, arguments);
    };
}());
var saveUser = exports.saveUser = _ramda2.default.curry(function () {
    var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(func, args) {
        var user, userHash, otherUsers, userWithOtherUsers, userDb, savedUser;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        args.userArgs.createdBy = args.authedUser;
                        user = func.createUser ? func.createUser(args.userArgs) : (0, _ptzUserDomain.createUser)(args.userArgs);

                        if (!func.hashPass) {
                            _context2.next = 8;
                            break;
                        }

                        _context2.next = 5;
                        return func.hashPass(user);

                    case 5:
                        _context2.t0 = _context2.sent;
                        _context2.next = 11;
                        break;

                    case 8:
                        _context2.next = 10;
                        return hashPassword(pHash(tokenSecret), user);

                    case 10:
                        _context2.t0 = _context2.sent;

                    case 11:
                        userHash = _context2.t0;

                        if (!(func.isValid ? !func.isValid(userHash) : !V.isValid(userHash))) {
                            _context2.next = 14;
                            break;
                        }

                        return _context2.abrupt('return', Promise.resolve(userHash));

                    case 14:
                        _context2.next = 16;
                        return func.userRepository.getOtherUsersWithSameUserNameOrEmail(userHash);

                    case 16:
                        otherUsers = _context2.sent;
                        userWithOtherUsers = func.otherUsersWithSameUserNameOrEmail ? func.otherUsersWithSameUserNameOrEmail(userHash, otherUsers) : (0, _ptzUserDomain.otherUsersWithSameUserNameOrEmail)(userHash, otherUsers);

                        if (!(func.isValid ? !func.isValid(userWithOtherUsers) : !V.isValid(userWithOtherUsers))) {
                            _context2.next = 20;
                            break;
                        }

                        return _context2.abrupt('return', Promise.resolve(userWithOtherUsers));

                    case 20:
                        _context2.next = 22;
                        return func.userRepository.getById(userWithOtherUsers.id);

                    case 22:
                        userDb = _context2.sent;

                        if (userDb) userWithOtherUsers = func.updateUser ? func.updateUser(userDb, userWithOtherUsers) : (0, _ptzUserDomain.updateUser)(userDb, userWithOtherUsers);
                        _context2.next = 26;
                        return func.userRepository.save(userWithOtherUsers);

                    case 26:
                        savedUser = _context2.sent;
                        return _context2.abrupt('return', Promise.resolve(savedUser));

                    case 28:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function (_x3, _x4) {
        return _ref2.apply(this, arguments);
    };
}());
// tslint:disable-next-line:max-line-length
var findUsers = exports.findUsers = _ramda2.default.curry(function () {
    var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(find, args) {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        return _context3.abrupt('return', find(args.query, { limit: args.options.limit }));

                    case 1:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, undefined);
    }));

    return function (_x5, _x6) {
        return _ref3.apply(this, arguments);
    };
}());
var authUser = exports.authUser = _ramda2.default.curry(function () {
    var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(getByUserNameOrEmail, args) {
        var form, user, isPasswordCorrect;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        form = args.form;
                        _context4.next = 3;
                        return getByUserNameOrEmail(form.userNameOrEmail);

                    case 3:
                        user = _context4.sent;

                        if (user) {
                            _context4.next = 6;
                            break;
                        }

                        return _context4.abrupt('return', Promise.resolve(null));

                    case 6:
                        _context4.next = 8;
                        return (0, _bcryptjs.compare)(form.password, user.passwordHash);

                    case 8:
                        isPasswordCorrect = _context4.sent;
                        return _context4.abrupt('return', Promise.resolve(isPasswordCorrect ? user : null));

                    case 10:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, undefined);
    }));

    return function (_x7, _x8) {
        return _ref4.apply(this, arguments);
    };
}());
var getAuthToken = exports.getAuthToken = _ramda2.default.curry(function () {
    var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(func, args) {
        var form, authToken, user, errors;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        form = func.authUserForm(args.form);
                        authToken = null;

                        if (V.isValid(form)) {
                            _context5.next = 4;
                            break;
                        }

                        return _context5.abrupt('return', Promise.resolve({
                            authToken: authToken,
                            user: null,
                            errors: form.errors
                        }));

                    case 4:
                        _context5.next = 6;
                        return func.authUser(args);

                    case 6:
                        user = _context5.sent;
                        errors = [];

                        if (user == null) errors.push(_ptzUserDomain.allErrors.ERROR_USERAPP_GETAUTHTOKEN_INVALID_USERNAME_OR_PASSWORD);else authToken = func.encode(user);
                        return _context5.abrupt('return', Promise.resolve({
                            authToken: authToken,
                            user: user,
                            errors: errors
                        }));

                    case 10:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _callee5, undefined);
    }));

    return function (_x9, _x10) {
        return _ref5.apply(this, arguments);
    };
}());
// tslint:disable-next-line:max-line-length
var verifyAuthToken = exports.verifyAuthToken = _ramda2.default.curry(function (decodeArgs, args) {
    var user = decodeArgs(args.token);
    return Promise.resolve(user);
});
var seed = exports.seed = _ramda2.default.curry(function (userRepository, authedUser) {
    var users = _ptzUserDomain.users.allUsers;
    users.forEach(function () {
        var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(user) {
            return regeneratorRuntime.wrap(function _callee6$(_context6) {
                while (1) {
                    switch (_context6.prev = _context6.next) {
                        case 0:
                            _context6.next = 2;
                            return saveUser({ userRepository: userRepository }, { userArgs: user, authedUser: authedUser });

                        case 2:
                            return _context6.abrupt('return', _context6.sent);

                        case 3:
                        case 'end':
                            return _context6.stop();
                    }
                }
            }, _callee6, undefined);
        }));

        return function (_x11) {
            return _ref6.apply(this, arguments);
        };
    }());
    return Promise.resolve(true);
});
var updatePassword = exports.updatePassword = function updatePassword(args) {
    return Promise.resolve(false);
};
var updatePasswordToken = exports.updatePasswordToken = function updatePasswordToken(args) {
    return Promise.resolve(false);
};
var deleteUser = exports.deleteUser = function deleteUser(args) {
    return Promise.resolve(false);
};
//# sourceMappingURL=userApp.js.map
//# sourceMappingURL=userApp.js.map