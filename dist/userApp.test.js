'use strict';

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _ptzAssert = require('ptz-assert');

var _ptzUserDomain = require('ptz-user-domain');

var _sinon = require('sinon');

var _index = require('./index');

var _UserRepositoryFake = require('./UserRepositoryFake');

var _UserRepositoryFake2 = _interopRequireDefault(_UserRepositoryFake);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

_dotenv2.default.config();

var authedUser = {
    dtCreated: new Date(),
    ip: '192.161.0.1'
};
var notCalled = 'notCalled';
describe('UserApp', function () {
    describe('save', function () {
        var userApp, userRepository;
        beforeEach(function () {
            userRepository = new _UserRepositoryFake2.default(null);
            (0, _sinon.spy)(userRepository, 'save');
            (0, _sinon.stub)(userRepository, 'getOtherUsersWithSameUserNameOrEmail').returns([]);
            userApp = new _index.UserApp({ userRepository: userRepository });
        });
        it('hash password', function () {
            return __awaiter(undefined, void 0, void 0, regeneratorRuntime.mark(function _callee() {
                var userArgs, user;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                userArgs = {
                                    userName: 'angeloocana',
                                    email: 'angeloocana@gmail.com',
                                    displayName: 'Ângelo Ocanã',
                                    password: 'testPassword'
                                };
                                _context.next = 3;
                                return userApp.saveUser({ userArgs: userArgs, authedUser: authedUser });

                            case 3:
                                user = _context.sent;

                                (0, _ptzAssert.ok)(user.passwordHash, 'passwordHash not set');
                                (0, _ptzAssert.notOk)(user.password, 'password not empty');

                            case 6:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));
        });
        it('do not call repository if user is invalid', function () {
            return __awaiter(undefined, void 0, void 0, regeneratorRuntime.mark(function _callee2() {
                var userArgs;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                userArgs = {
                                    userName: '',
                                    email: '',
                                    displayName: ''
                                };
                                _context2.next = 3;
                                return userApp.saveUser({ userArgs: userArgs, authedUser: authedUser });

                            case 3:
                                (0, _ptzAssert.ok)(userRepository.save[notCalled]);

                            case 4:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));
        });
        it('call repository if User is valid', function () {
            return __awaiter(undefined, void 0, void 0, regeneratorRuntime.mark(function _callee3() {
                var userArgs, calledOnce;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                userArgs = {
                                    userName: 'angeloocana',
                                    email: 'angeloocana@gmail.com',
                                    displayName: 'Angelo Ocana'
                                };
                                _context3.next = 3;
                                return userApp.saveUser({ userArgs: userArgs, authedUser: authedUser });

                            case 3:
                                calledOnce = 'calledOnce';

                                (0, _ptzAssert.ok)(userRepository.save[calledOnce]);

                            case 5:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));
        });
        it('set createdBy', function () {
            return __awaiter(undefined, void 0, void 0, regeneratorRuntime.mark(function _callee4() {
                var userArgs, user;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                userArgs = {
                                    userName: 'angeloocana',
                                    email: 'angeloocana@gmail.com',
                                    displayName: ''
                                };
                                _context4.next = 3;
                                return userApp.saveUser({ userArgs: userArgs, authedUser: authedUser });

                            case 3:
                                user = _context4.sent;

                                (0, _ptzAssert.equal)(user.createdBy, authedUser);

                            case 5:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));
        });
    });
    describe('authUser', function () {
        var userApp, userRepository;
        beforeEach(function () {
            userRepository = new _UserRepositoryFake2.default(null);
            userApp = new _index.UserApp({ userRepository: userRepository });
        });
        it('return null when User not found', function () {
            return __awaiter(undefined, void 0, void 0, regeneratorRuntime.mark(function _callee5() {
                var userNameOrEmail, password, user;
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                userNameOrEmail = 'angeloocana', password = 'teste';

                                (0, _sinon.stub)(userRepository, 'getByUserNameOrEmail').returns(null);
                                _context5.next = 4;
                                return userApp.authUser({
                                    form: { userNameOrEmail: userNameOrEmail, password: password },
                                    authedUser: authedUser
                                });

                            case 4:
                                user = _context5.sent;

                                (0, _ptzAssert.notOk)(user);

                            case 6:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));
        });
        it('return null when User found but incorrect password', function () {
            return __awaiter(undefined, void 0, void 0, regeneratorRuntime.mark(function _callee6() {
                var password, user;
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                password = 'testeteste';
                                user = new _ptzUserDomain.User({
                                    userName: 'angeloocana',
                                    email: '',
                                    displayName: '',
                                    password: password
                                });
                                _context6.next = 4;
                                return userApp.hashPassword(user);

                            case 4:
                                user = _context6.sent;

                                (0, _sinon.stub)(userRepository, 'getByUserNameOrEmail').returns(user);
                                _context6.next = 8;
                                return userApp.authUser({
                                    form: {
                                        userNameOrEmail: user.userName,
                                        password: 'incorrectPassword'
                                    },
                                    authedUser: authedUser
                                });

                            case 8:
                                user = _context6.sent;

                                (0, _ptzAssert.notOk)(user);

                            case 10:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));
        });
        it('return user when correct password', function () {
            return __awaiter(undefined, void 0, void 0, regeneratorRuntime.mark(function _callee7() {
                var password, user;
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                password = 'testeteste';
                                user = new _ptzUserDomain.User({
                                    userName: 'angeloocana',
                                    email: 'alanmarcell@live.com',
                                    displayName: 'Angelo Ocana',
                                    password: password
                                });
                                _context7.next = 4;
                                return userApp.hashPassword(user);

                            case 4:
                                user = _context7.sent;

                                (0, _sinon.stub)(userRepository, 'getByUserNameOrEmail').returns(user);
                                _context7.next = 8;
                                return userApp.authUser({
                                    form: {
                                        userNameOrEmail: user.userName,
                                        password: password
                                    },
                                    authedUser: authedUser
                                });

                            case 8:
                                user = _context7.sent;

                                (0, _ptzAssert.ok)(user);
                                (0, _ptzAssert.emptyArray)(user.errors);

                            case 11:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));
        });
    });
    describe('getAuthToken', function () {
        it('add errors when invalid userName or Email', function () {
            return __awaiter(undefined, void 0, void 0, regeneratorRuntime.mark(function _callee8() {
                var userRepository, userApp, authToken;
                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                userRepository = new _UserRepositoryFake2.default(null);
                                userApp = new _index.UserApp({ userRepository: userRepository });

                                (0, _sinon.spy)(userRepository, 'getByUserNameOrEmail');
                                _context8.next = 5;
                                return userApp.getAuthToken({
                                    form: {
                                        userNameOrEmail: 'ln',
                                        password: 'testtest'
                                    },
                                    authedUser: authedUser
                                });

                            case 5:
                                authToken = _context8.sent;

                                (0, _ptzAssert.ok)(userRepository.getByUserNameOrEmail[notCalled], 'Do NOT call repository getByUserNameOrEmail()');
                                (0, _ptzAssert.notOk)(authToken.authToken, 'Do NOT Generate token');
                                (0, _ptzAssert.notOk)(authToken.user, 'DO NOT return user');
                                (0, _ptzAssert.notEmptyArray)(authToken.errors, 'return errors');

                            case 10:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));
        });
        it('add error when invalid password', function () {
            return __awaiter(undefined, void 0, void 0, regeneratorRuntime.mark(function _callee9() {
                var userRepository, userApp, authToken;
                return regeneratorRuntime.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                userRepository = new _UserRepositoryFake2.default(null);
                                userApp = new _index.UserApp({ userRepository: userRepository });

                                (0, _sinon.spy)(userRepository, 'getByUserNameOrEmail');
                                _context9.next = 5;
                                return userApp.getAuthToken({
                                    form: {
                                        userNameOrEmail: 'angeloocana',
                                        password: 't'
                                    },
                                    authedUser: authedUser
                                });

                            case 5:
                                authToken = _context9.sent;

                                (0, _ptzAssert.ok)(userRepository.getByUserNameOrEmail[notCalled], 'Do NOT call repository getByUserNameOrEmail()');
                                (0, _ptzAssert.notOk)(authToken.authToken, 'Do NOT Generate token');
                                (0, _ptzAssert.notOk)(authToken.user, 'DO NOT return user');
                                (0, _ptzAssert.notEmptyArray)(authToken.errors, 'return errors');

                            case 10:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));
        });
        it('generate token when correct password', function () {
            return __awaiter(undefined, void 0, void 0, regeneratorRuntime.mark(function _callee10() {
                var userRepository, userApp, user, authToken;
                return regeneratorRuntime.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                userRepository = new _UserRepositoryFake2.default(null);
                                userApp = new _index.UserApp({ userRepository: userRepository });
                                user = new _ptzUserDomain.User({
                                    userName: 'lnsilva',
                                    email: 'lucas.neris@globalpoints.com.br', displayName: 'Lucas Neris',
                                    password: '123456'
                                });
                                _context10.next = 5;
                                return userApp.hashPassword(user);

                            case 5:
                                user = _context10.sent;

                                (0, _sinon.stub)(userRepository, 'getByUserNameOrEmail').returns(user);
                                _context10.next = 9;
                                return userApp.getAuthToken({
                                    form: {
                                        userNameOrEmail: 'lnsilva',
                                        password: '123456'
                                    },
                                    authedUser: authedUser
                                });

                            case 9:
                                authToken = _context10.sent;

                                (0, _ptzAssert.ok)(authToken.authToken, 'Empty Token');
                                (0, _ptzAssert.ok)(authToken.user, 'no user');
                                (0, _ptzAssert.ok)(authToken.user.id, 'no user id');
                                (0, _ptzAssert.emptyArray)(authToken.errors, 'return errors');

                            case 14:
                            case 'end':
                                return _context10.stop();
                        }
                    }
                }, _callee10, this);
            }));
        });
        it('add errors when incorrect password', function () {
            return __awaiter(undefined, void 0, void 0, regeneratorRuntime.mark(function _callee11() {
                var userRepository, userApp, authToken;
                return regeneratorRuntime.wrap(function _callee11$(_context11) {
                    while (1) {
                        switch (_context11.prev = _context11.next) {
                            case 0:
                                userRepository = new _UserRepositoryFake2.default(null);
                                userApp = new _index.UserApp({ userRepository: userRepository });

                                (0, _sinon.stub)(userRepository, 'getByUserNameOrEmail').returns(null);
                                _context11.next = 5;
                                return userApp.getAuthToken({
                                    form: {
                                        userNameOrEmail: 'lnsilva',
                                        password: '123456'
                                    },
                                    authedUser: authedUser
                                });

                            case 5:
                                authToken = _context11.sent;

                                (0, _ptzAssert.notOk)(authToken.authToken, 'do not generate token');
                                (0, _ptzAssert.notOk)(authToken.user, 'do not return user');
                                (0, _ptzAssert.contains)(authToken.errors, _ptzUserDomain.allErrors.ERROR_USERAPP_GETAUTHTOKEN_INVALID_USERNAME_OR_PASSWORD, 'return invalid userName, email or password error');

                            case 9:
                            case 'end':
                                return _context11.stop();
                        }
                    }
                }, _callee11, this);
            }));
        });
    });
    describe('verifyAuthToken', function () {
        var userApp, userRepository;
        beforeEach(function () {
            userRepository = new _UserRepositoryFake2.default(null);
            userApp = new _index.UserApp({ userRepository: userRepository });
        });
        it('Invalid token throws exception', function () {
            return __awaiter(undefined, void 0, void 0, regeneratorRuntime.mark(function _callee12() {
                var hasError;
                return regeneratorRuntime.wrap(function _callee12$(_context12) {
                    while (1) {
                        switch (_context12.prev = _context12.next) {
                            case 0:
                                hasError = false;
                                _context12.prev = 1;
                                _context12.next = 4;
                                return userApp.verifyAuthToken({
                                    token: 'Invalid_Token',
                                    authedUser: authedUser
                                });

                            case 4:
                                _context12.next = 9;
                                break;

                            case 6:
                                _context12.prev = 6;
                                _context12.t0 = _context12['catch'](1);

                                hasError = true;

                            case 9:
                                (0, _ptzAssert.ok)(hasError);

                            case 10:
                            case 'end':
                                return _context12.stop();
                        }
                    }
                }, _callee12, this, [[1, 6]]);
            }));
        });
        it('Valid token return user', function () {
            return __awaiter(undefined, void 0, void 0, regeneratorRuntime.mark(function _callee13() {
                var user, authToken, userByToken;
                return regeneratorRuntime.wrap(function _callee13$(_context13) {
                    while (1) {
                        switch (_context13.prev = _context13.next) {
                            case 0:
                                user = new _ptzUserDomain.User({
                                    userName: 'lnsilva',
                                    email: 'lucas.neris@globalpoints.com.br',
                                    displayName: 'Lucas Neris',
                                    password: '123456'
                                });
                                _context13.next = 3;
                                return userApp.hashPassword(user);

                            case 3:
                                user = _context13.sent;

                                (0, _sinon.stub)(userRepository, 'getByUserNameOrEmail').returns(user);
                                _context13.next = 7;
                                return userApp.getAuthToken({
                                    form: {
                                        userNameOrEmail: 'lnsilva',
                                        password: '123456'
                                    },
                                    authedUser: authedUser
                                });

                            case 7:
                                authToken = _context13.sent;

                                (0, _ptzAssert.ok)(authToken.authToken, 'Empty Token');
                                _context13.next = 11;
                                return userApp.verifyAuthToken({
                                    token: authToken.authToken,
                                    authedUser: authedUser
                                });

                            case 11:
                                userByToken = _context13.sent;

                                (0, _ptzAssert.equal)(userByToken.id, user.id, 'User Id dont match');
                                (0, _ptzAssert.equal)(userByToken.email, user.email, 'User Id dont match');
                                (0, _ptzAssert.equal)(userByToken.userName, user.userName, 'User Id dont match');
                                (0, _ptzAssert.equal)(userByToken.displayName, user.displayName, 'User Id dont match');

                            case 16:
                            case 'end':
                                return _context13.stop();
                        }
                    }
                }, _callee13, this);
            }));
        });
    });
});
//# sourceMappingURL=userApp.test.js.map
//# sourceMappingURL=userApp.test.js.map