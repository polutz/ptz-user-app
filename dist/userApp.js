'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.deleteUser = exports.updatePasswordToken = exports.updatePassword = exports.seed = exports.verifyAuthToken = exports.getAuthToken = exports.authUser = exports.findUsers = exports.saveUser = exports.hashPassword = exports.createApp = exports.passwordSalt = exports.tokenSecret = undefined;

var hashPassword = exports.hashPassword = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(user) {
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
                        if (passwordSalt) {
                            _context.next = 4;
                            break;
                        }

                        throw new Error('passwordSalt not added to process.env.');

                    case 4:
                        _context.next = 6;
                        return (0, _bcryptjs.hash)(user.password, passwordSalt);

                    case 6:
                        user.passwordHash = _context.sent;

                        user.password = undefined;
                        return _context.abrupt('return', Promise.resolve(user));

                    case 9:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function hashPassword(_x) {
        return _ref.apply(this, arguments);
    };
}();

var _ptzUserDomain = require('@alanmarcell/ptz-user-domain');

var _ptzValidations = require('ptz-validations');

var V = _interopRequireWildcard(_ptzValidations);

var _bcryptjs = require('bcryptjs');

var _jwtSimple = require('jwt-simple');

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var tokenSecret = exports.tokenSecret = process.env.PASSWORD_SALT;
var passwordSalt = exports.passwordSalt = process.env.PASSWORD_SALT;
var getSalt = function getSalt() {
    exports.tokenSecret = tokenSecret = process.env.PASSWORD_SALT;
    exports.passwordSalt = passwordSalt = process.env.PASSWORD_SALT;
};
var createApp = exports.createApp = function createApp(userAppArgs) {
    getSalt();
    var userRepository = userAppArgs.userRepository;
    return {
        saveUser: saveUser(userRepository),
        findUsers: findUsers(userRepository),
        authUser: authUser(userRepository),
        getAuthToken: getAuthToken(userRepository),
        verifyAuthToken: verifyAuthToken(userRepository),
        updatePassword: updatePassword,
        updatePasswordToken: updatePasswordToken,
        deleteUser: deleteUser,
        hashPassword: hashPassword,
        seed: seed(userRepository)
    };
};
var saveUser = exports.saveUser = _ramda2.default.curry(function () {
    var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(userRepository, args) {
        var user, otherUsers, userDb;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        args.userArgs.createdBy = args.authedUser;
                        user = (0, _ptzUserDomain.createUser)(args.userArgs);
                        _context2.next = 4;
                        return hashPassword(user);

                    case 4:
                        user = _context2.sent;

                        if (V.isValid(user)) {
                            _context2.next = 7;
                            break;
                        }

                        return _context2.abrupt('return', Promise.resolve(user));

                    case 7:
                        _context2.next = 9;
                        return userRepository.getOtherUsersWithSameUserNameOrEmail(user);

                    case 9:
                        otherUsers = _context2.sent;

                        user = (0, _ptzUserDomain.otherUsersWithSameUserNameOrEmail)(user, otherUsers);

                        if (V.isValid(user)) {
                            _context2.next = 13;
                            break;
                        }

                        return _context2.abrupt('return', Promise.resolve(user));

                    case 13:
                        _context2.next = 15;
                        return userRepository.getById(user.id);

                    case 15:
                        userDb = _context2.sent;

                        if (userDb) user = (0, _ptzUserDomain.updateUser)(userDb, user);
                        _context2.next = 19;
                        return userRepository.save(user);

                    case 19:
                        user = _context2.sent;
                        return _context2.abrupt('return', Promise.resolve(user));

                    case 21:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function (_x2, _x3) {
        return _ref2.apply(this, arguments);
    };
}());
var findUsers = exports.findUsers = _ramda2.default.curry(function (userRepository, args) {
    return userRepository.find(args.query, { limit: args.options.limit });
});
var authUser = exports.authUser = _ramda2.default.curry(function () {
    var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(userRepository, args) {
        var form, user, isPasswordCorrect;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        form = args.form;
                        _context3.next = 3;
                        return userRepository.getByUserNameOrEmail(form.userNameOrEmail);

                    case 3:
                        user = _context3.sent;

                        if (user) {
                            _context3.next = 6;
                            break;
                        }

                        return _context3.abrupt('return', Promise.resolve(null));

                    case 6:
                        _context3.next = 8;
                        return (0, _bcryptjs.compare)(form.password, user.passwordHash);

                    case 8:
                        isPasswordCorrect = _context3.sent;
                        return _context3.abrupt('return', Promise.resolve(isPasswordCorrect ? user : null));

                    case 10:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, undefined);
    }));

    return function (_x4, _x5) {
        return _ref3.apply(this, arguments);
    };
}());
var getAuthToken = exports.getAuthToken = _ramda2.default.curry(function () {
    var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(userRepository, args) {
        var form, authToken, user, errors;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        form = (0, _ptzUserDomain.authUserForm)(args.form);
                        authToken = null;

                        if (V.isValid(form)) {
                            _context4.next = 4;
                            break;
                        }

                        return _context4.abrupt('return', Promise.resolve({
                            authToken: authToken,
                            user: null,
                            errors: form.errors
                        }));

                    case 4:
                        _context4.next = 6;
                        return authUser(userRepository, args);

                    case 6:
                        user = _context4.sent;
                        errors = [];

                        if (user == null) errors.push(_ptzUserDomain.allErrors.ERROR_USERAPP_GETAUTHTOKEN_INVALID_USERNAME_OR_PASSWORD);else authToken = (0, _jwtSimple.encode)(user, tokenSecret);
                        return _context4.abrupt('return', Promise.resolve({
                            authToken: authToken,
                            user: user,
                            errors: errors
                        }));

                    case 10:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, undefined);
    }));

    return function (_x6, _x7) {
        return _ref4.apply(this, arguments);
    };
}());
// tslint:disable-next-line:max-line-length
var verifyAuthToken = exports.verifyAuthToken = _ramda2.default.curry(function (userRepository, args) {
    var user = (0, _jwtSimple.decode)(args.token, passwordSalt);
    return Promise.resolve(user);
});
var seed = exports.seed = _ramda2.default.curry(function (repository, authedUser) {
    var users = _ptzUserDomain.users.allUsers;
    users.forEach(function () {
        var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(user) {
            return regeneratorRuntime.wrap(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            _context5.next = 2;
                            return saveUser(repository, { userArgs: user, authedUser: authedUser });

                        case 2:
                            return _context5.abrupt('return', _context5.sent);

                        case 3:
                        case 'end':
                            return _context5.stop();
                    }
                }
            }, _callee5, undefined);
        }));

        return function (_x8) {
            return _ref5.apply(this, arguments);
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