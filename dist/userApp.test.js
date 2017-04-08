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
                var user;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                user = {
                                    userName: 'angeloocana',
                                    email: 'angeloocana@gmail.com',
                                    displayName: 'Ângelo Ocanã',
                                    password: 'testPassword'
                                };
                                _context.next = 3;
                                return userApp.save(user);

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
                var user, notCalled;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                user = {
                                    userName: '',
                                    email: '',
                                    displayName: ''
                                };
                                _context2.next = 3;
                                return userApp.save(user);

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
                var user, calledOnce;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                user = {
                                    userName: 'angeloocana',
                                    email: 'angeloocana@gmail.com',
                                    displayName: ''
                                };
                                _context3.next = 3;
                                return userApp.save(user);

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
    });
    describe('authenticateUser', function () {
        var userApp, userRepository;
        beforeEach(function () {
            userRepository = new _UserRepositoryFake2.default(null);
            userApp = new _userApp2.default({ userRepository: userRepository });
        });
        it('User not found should return user with error', function () {
            return __awaiter(undefined, void 0, void 0, regeneratorRuntime.mark(function _callee4() {
                var userName, user;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                userName = 'angeloocana';

                                (0, _sinon.stub)(userRepository, 'getByUserNameOrEmail').returns(null);
                                _context4.next = 4;
                                return userApp.authenticateUser(userName, 'teste');

                            case 4:
                                user = _context4.sent;

                                (0, _ptzAssert.contains)(user.errors, 'ERROR_USER_INVALID_USERNAME_OR_PASSWORD');

                            case 6:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));
        });
        it('User found but incorrect password should return user with error', function () {
            return __awaiter(undefined, void 0, void 0, regeneratorRuntime.mark(function _callee5() {
                var password, user;
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                password = 'testeteste';
                                user = new _ptzUserDomain.User({
                                    userName: 'angeloocana',
                                    email: '',
                                    displayName: '',
                                    password: password
                                });
                                _context5.next = 4;
                                return userApp.hashPassword(user);

                            case 4:
                                user = _context5.sent;

                                (0, _sinon.stub)(userRepository, 'getByUserNameOrEmail').returns(user);
                                _context5.next = 8;
                                return userApp.authenticateUser(user.userName, 'incorrectPassword');

                            case 8:
                                user = _context5.sent;

                                (0, _ptzAssert.contains)(user.errors, 'ERROR_USER_INVALID_USERNAME_OR_PASSWORD');

                            case 10:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));
        });
        it('User found and correct password should return the user', function () {
            return __awaiter(undefined, void 0, void 0, regeneratorRuntime.mark(function _callee6() {
                var password, user;
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                password = 'testeteste';
                                user = new _ptzUserDomain.User({
                                    userName: 'angeloocana',
                                    email: 'alanmarcell@live.com',
                                    displayName: '',
                                    password: password
                                });
                                _context6.next = 4;
                                return userApp.hashPassword(user);

                            case 4:
                                user = _context6.sent;

                                (0, _sinon.stub)(userRepository, 'getByUserNameOrEmail').returns(user);
                                _context6.next = 8;
                                return userApp.authenticateUser(user.userName, password);

                            case 8:
                                user = _context6.sent;

                                (0, _ptzAssert.ok)(user);
                                (0, _ptzAssert.emptyArray)(user.errors);

                            case 11:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
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
            return __awaiter(undefined, void 0, void 0, regeneratorRuntime.mark(function _callee7() {
                var user, userToken;
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                user = new _ptzUserDomain.User({
                                    userName: 'lnsilva',
                                    email: 'lucas.neris@globalpoints.com.br', displayName: 'Lucas Neris',
                                    password: '123456'
                                });
                                _context7.next = 3;
                                return userApp.hashPassword(user);

                            case 3:
                                user = _context7.sent;

                                (0, _sinon.stub)(userRepository, 'getByUserNameOrEmail').returns(user);
                                _context7.next = 7;
                                return userApp.getAuthToken('lnsilva', '123456');

                            case 7:
                                userToken = _context7.sent;

                                (0, _ptzAssert.ok)(userToken.accessToken, 'Empty Token');

                            case 9:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));
        });
        it('When user is invalid password does not generate token', function () {
            return __awaiter(undefined, void 0, void 0, regeneratorRuntime.mark(function _callee8() {
                var user, userToken;
                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                user = _ptzUserDomain.User.getUserAthenticationError('');

                                (0, _sinon.stub)(userRepository, 'getByUserNameOrEmail').returns(null);
                                _context8.next = 4;
                                return userApp.getAuthToken('lnsilva', '123456');

                            case 4:
                                userToken = _context8.sent;

                                (0, _ptzAssert.notOk)(userToken.accessToken, 'Not Empty Token');

                            case 6:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
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
            return __awaiter(undefined, void 0, void 0, regeneratorRuntime.mark(function _callee9() {
                var hasError;
                return regeneratorRuntime.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                hasError = false;
                                _context9.prev = 1;
                                _context9.next = 4;
                                return userApp.verifyAuthToken('Invalid_Token');

                            case 4:
                                _context9.next = 9;
                                break;

                            case 6:
                                _context9.prev = 6;
                                _context9.t0 = _context9['catch'](1);

                                hasError = true;

                            case 9:
                                (0, _ptzAssert.ok)(hasError);

                            case 10:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this, [[1, 6]]);
            }));
        });
        it('Valid token return user', function () {
            return __awaiter(undefined, void 0, void 0, regeneratorRuntime.mark(function _callee10() {
                var user, userToken, userByToken;
                return regeneratorRuntime.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                user = new _ptzUserDomain.User({
                                    userName: 'lnsilva',
                                    email: 'lucas.neris@globalpoints.com.br',
                                    displayName: 'Lucas Neris',
                                    password: '123456'
                                });
                                _context10.next = 3;
                                return userApp.hashPassword(user);

                            case 3:
                                user = _context10.sent;

                                (0, _sinon.stub)(userRepository, 'getByUserNameOrEmail').returns(user);
                                _context10.next = 7;
                                return userApp.getAuthToken('lnsilva', '123456');

                            case 7:
                                userToken = _context10.sent;

                                (0, _ptzAssert.ok)(userToken.accessToken, 'Empty Token');
                                _context10.next = 11;
                                return userApp.verifyAuthToken(userToken.accessToken);

                            case 11:
                                userByToken = _context10.sent;

                                (0, _ptzAssert.equal)(userByToken.id, user.id, 'User Id dont match');
                                (0, _ptzAssert.equal)(userByToken.email, user.email, 'User Id dont match');
                                (0, _ptzAssert.equal)(userByToken.userName, user.userName, 'User Id dont match');
                                (0, _ptzAssert.equal)(userByToken.displayName, user.displayName, 'User Id dont match');

                            case 16:
                            case 'end':
                                return _context10.stop();
                        }
                    }
                }, _callee10, this);
            }));
        });
    });
});
//# sourceMappingURL=userApp.test.js.map