'use strict';

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _ptzAssert = require('ptz-assert');

var _ptzUserDomain = require('ptz-user-domain');

var _sinon = require('sinon');

var _userApp = require('./userApp');

var _userApp2 = _interopRequireDefault(_userApp);

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

var createdBy = {
    dtCreated: new Date(),
    ip: ''
};
describe('UserApp', function () {
    describe('save', function () {
        var userApp, userRepository;
        beforeEach(function () {
            userRepository = new _UserRepositoryFake2.default(null);
            (0, _sinon.spy)(userRepository, 'save');
            (0, _sinon.stub)(userRepository, 'getOtherUsersWithSameUserNameOrEmail').returns([]);
            userApp = new _userApp2.default({ userRepository: userRepository });
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
                                return userApp.save({ userArgs: userArgs, createdBy: createdBy });

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
                var userArgs, notCalled;
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
                                return userApp.save({ userArgs: userArgs, createdBy: createdBy });

                            case 3:
                                notCalled = 'notCalled';

                                (0, _ptzAssert.ok)(userRepository.save[notCalled]);

                            case 5:
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
                                    displayName: ''
                                };
                                _context3.next = 3;
                                return userApp.save({ userArgs: userArgs, createdBy: createdBy });

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
                                return userApp.save({ userArgs: userArgs, createdBy: createdBy });

                            case 3:
                                user = _context4.sent;

                                (0, _ptzAssert.equal)(user.createdBy, createdBy);

                            case 5:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));
        });
    });
    describe('authenticateUser', function () {
        var userApp, userRepository;
        beforeEach(function () {
            userRepository = new _UserRepositoryFake2.default(null);
            userApp = new _userApp2.default({ userRepository: userRepository });
        });
        it('User not found should return null', function () {
            return __awaiter(undefined, void 0, void 0, regeneratorRuntime.mark(function _callee5() {
                var userNameOrEmail, password, user;
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                userNameOrEmail = 'angeloocana', password = 'teste';

                                (0, _sinon.stub)(userRepository, 'getByUserNameOrEmail').returns(null);
                                _context5.next = 4;
                                return userApp.authenticateUser({
                                    form: { userNameOrEmail: userNameOrEmail, password: password },
                                    createdBy: createdBy
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
        it('User found but incorrect password should return null', function () {
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
                                return userApp.authenticateUser({
                                    form: {
                                        userNameOrEmail: user.userName,
                                        password: 'incorrectPassword'
                                    },
                                    createdBy: createdBy
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
        it('User found and correct password should return the user', function () {
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
                                    displayName: '',
                                    password: password
                                });
                                _context7.next = 4;
                                return userApp.hashPassword(user);

                            case 4:
                                user = _context7.sent;

                                (0, _sinon.stub)(userRepository, 'getByUserNameOrEmail').returns(user);
                                _context7.next = 8;
                                return userApp.authenticateUser({
                                    form: {
                                        userNameOrEmail: user.userName,
                                        password: password
                                    },
                                    createdBy: createdBy
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
        var userApp, userRepository;
        beforeEach(function () {
            userRepository = new _UserRepositoryFake2.default(null);
            userApp = new _userApp2.default({ userRepository: userRepository });
        });
        it('When user is valid password generate token', function () {
            return __awaiter(undefined, void 0, void 0, regeneratorRuntime.mark(function _callee8() {
                var user, authToken;
                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                user = new _ptzUserDomain.User({
                                    userName: 'lnsilva',
                                    email: 'lucas.neris@globalpoints.com.br', displayName: 'Lucas Neris',
                                    password: '123456'
                                });
                                _context8.next = 3;
                                return userApp.hashPassword(user);

                            case 3:
                                user = _context8.sent;

                                (0, _sinon.stub)(userRepository, 'getByUserNameOrEmail').returns(user);
                                _context8.next = 7;
                                return userApp.getAuthToken({
                                    form: {
                                        userNameOrEmail: 'lnsilva',
                                        password: '123456'
                                    },
                                    createdBy: createdBy
                                });

                            case 7:
                                authToken = _context8.sent;

                                (0, _ptzAssert.ok)(authToken.authToken, 'Empty Token');

                            case 9:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));
        });
        describe('invalid password', function () {
            return __awaiter(undefined, void 0, void 0, regeneratorRuntime.mark(function _callee9() {
                var authToken;
                return regeneratorRuntime.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                (0, _sinon.stub)(userRepository, 'getByUserNameOrEmail').returns(null);
                                _context9.next = 3;
                                return userApp.getAuthToken({
                                    form: {
                                        userNameOrEmail: 'lnsilva',
                                        password: '123456'
                                    },
                                    createdBy: createdBy
                                });

                            case 3:
                                authToken = _context9.sent;

                                it('do not generate token', function () {
                                    (0, _ptzAssert.notOk)(authToken.authToken);
                                });
                                it('do not return user', function () {
                                    (0, _ptzAssert.notOk)(authToken.user);
                                });
                                it('return invalid userName, email or password error', function () {
                                    (0, _ptzAssert.contains)(authToken.errors, _ptzUserDomain.errors.ERROR_USERAPP_GETAUTHTOKEN_INVALID_USERNAME_OR_PASSWORD);
                                });

                            case 7:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));
        });
    });
    describe('verifyAuthToken', function () {
        var userApp, userRepository;
        beforeEach(function () {
            userRepository = new _UserRepositoryFake2.default(null);
            userApp = new _userApp2.default({ userRepository: userRepository });
        });
        it('Invalid token throws exception', function () {
            return __awaiter(undefined, void 0, void 0, regeneratorRuntime.mark(function _callee10() {
                var hasError;
                return regeneratorRuntime.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                hasError = false;
                                _context10.prev = 1;
                                _context10.next = 4;
                                return userApp.verifyAuthToken({
                                    token: 'Invalid_Token',
                                    createdBy: createdBy
                                });

                            case 4:
                                _context10.next = 9;
                                break;

                            case 6:
                                _context10.prev = 6;
                                _context10.t0 = _context10['catch'](1);

                                hasError = true;

                            case 9:
                                (0, _ptzAssert.ok)(hasError);

                            case 10:
                            case 'end':
                                return _context10.stop();
                        }
                    }
                }, _callee10, this, [[1, 6]]);
            }));
        });
        it('Valid token return user', function () {
            return __awaiter(undefined, void 0, void 0, regeneratorRuntime.mark(function _callee11() {
                var user, authToken, userByToken;
                return regeneratorRuntime.wrap(function _callee11$(_context11) {
                    while (1) {
                        switch (_context11.prev = _context11.next) {
                            case 0:
                                user = new _ptzUserDomain.User({
                                    userName: 'lnsilva',
                                    email: 'lucas.neris@globalpoints.com.br',
                                    displayName: 'Lucas Neris',
                                    password: '123456'
                                });
                                _context11.next = 3;
                                return userApp.hashPassword(user);

                            case 3:
                                user = _context11.sent;

                                (0, _sinon.stub)(userRepository, 'getByUserNameOrEmail').returns(user);
                                _context11.next = 7;
                                return userApp.getAuthToken({
                                    form: {
                                        userNameOrEmail: 'lnsilva',
                                        password: '123456'
                                    },
                                    createdBy: createdBy
                                });

                            case 7:
                                authToken = _context11.sent;

                                (0, _ptzAssert.ok)(authToken.authToken, 'Empty Token');
                                _context11.next = 11;
                                return userApp.verifyAuthToken({
                                    token: authToken.authToken,
                                    createdBy: createdBy
                                });

                            case 11:
                                userByToken = _context11.sent;

                                (0, _ptzAssert.equal)(userByToken.id, user.id, 'User Id dont match');
                                (0, _ptzAssert.equal)(userByToken.email, user.email, 'User Id dont match');
                                (0, _ptzAssert.equal)(userByToken.userName, user.userName, 'User Id dont match');
                                (0, _ptzAssert.equal)(userByToken.displayName, user.displayName, 'User Id dont match');

                            case 16:
                            case 'end':
                                return _context11.stop();
                        }
                    }
                }, _callee11, this);
            }));
        });
    });
});
//# sourceMappingURL=userApp.test.js.map