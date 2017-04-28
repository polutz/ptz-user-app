'use strict';

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _ptzAssert = require('ptz-assert');

var _ptzUserDomain = require('ptz-user-domain');

var _sinon = require('sinon');

var _index = require('./index');

var _UserRepositoryFake = require('./UserRepositoryFake');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

_dotenv2.default.config();

var authedUser = {
    dtCreated: new Date(),
    ip: '192.161.0.1'
};
var notCalled = 'notCalled';
describe('UserApp', function () {
    describe('saveUser', function () {
        describe('insert', function () {
            var userApp, userRepository;
            beforeEach(function () {
                userRepository = new _UserRepositoryFake.UserRepositoryFake(null);
                (0, _sinon.spy)(userRepository, 'save');
                (0, _sinon.stub)(userRepository, 'getOtherUsersWithSameUserNameOrEmail').returns([]);
                userApp = new _index.UserApp({ userRepository: userRepository });
            });
            it('hash password', _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
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
                }, _callee, undefined);
            })));
            it('do not call repository if user is invalid', _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
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
                }, _callee2, undefined);
            })));
            it('call repository if User is valid', _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
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
                }, _callee3, undefined);
            })));
            it('set createdBy', _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
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
                }, _callee4, undefined);
            })));
        });
        describe('update', function () {
            it('update when new user data is valid', _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
                var userRepository, dbUser, userApp, userArgs, userSaved, calledOnce;
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                userRepository = new _UserRepositoryFake.UserRepositoryFake(null);

                                (0, _sinon.spy)(userRepository, 'save');
                                (0, _sinon.stub)(userRepository, 'getOtherUsersWithSameUserNameOrEmail').returns([]);
                                dbUser = new _ptzUserDomain.User({
                                    userName: 'angeloocana',
                                    email: 'angeloocana@gmail.com',
                                    displayName: 'Angelo Ocana'
                                });

                                (0, _sinon.stub)(userRepository, 'getById').returns(dbUser);
                                userApp = new _index.UserApp({ userRepository: userRepository });
                                userArgs = {
                                    userName: 'angeloocana',
                                    email: 'angeloocana@gmail.com',
                                    displayName: 'Angelo Ocana Updated'
                                };
                                _context5.next = 9;
                                return userApp.saveUser({ userArgs: userArgs, authedUser: authedUser });

                            case 9:
                                userSaved = _context5.sent;
                                calledOnce = 'calledOnce';

                                (0, _ptzAssert.ok)(userRepository.save[calledOnce]);
                                (0, _ptzAssert.equal)(userSaved.displayName, userArgs.displayName);

                            case 13:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, undefined);
            })));
        });
    });
    describe('authUser', function () {
        var userApp, userRepository;
        beforeEach(function () {
            userRepository = new _UserRepositoryFake.UserRepositoryFake(null);
            userApp = new _index.UserApp({ userRepository: userRepository });
        });
        it('return null when User not found', _asyncToGenerator(regeneratorRuntime.mark(function _callee6() {
            var userNameOrEmail, password, user;
            return regeneratorRuntime.wrap(function _callee6$(_context6) {
                while (1) {
                    switch (_context6.prev = _context6.next) {
                        case 0:
                            userNameOrEmail = 'angeloocana', password = 'teste';

                            (0, _sinon.stub)(userRepository, 'getByUserNameOrEmail').returns(null);
                            _context6.next = 4;
                            return userApp.authUser({
                                form: { userNameOrEmail: userNameOrEmail, password: password },
                                authedUser: authedUser
                            });

                        case 4:
                            user = _context6.sent;

                            (0, _ptzAssert.notOk)(user);

                        case 6:
                        case 'end':
                            return _context6.stop();
                    }
                }
            }, _callee6, undefined);
        })));
        it('return null when User found but incorrect password', _asyncToGenerator(regeneratorRuntime.mark(function _callee7() {
            var password, user;
            return regeneratorRuntime.wrap(function _callee7$(_context7) {
                while (1) {
                    switch (_context7.prev = _context7.next) {
                        case 0:
                            password = 'testeteste';
                            user = new _ptzUserDomain.User({
                                userName: 'angeloocana',
                                email: '',
                                displayName: '',
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
                                    password: 'incorrectPassword'
                                },
                                authedUser: authedUser
                            });

                        case 8:
                            user = _context7.sent;

                            (0, _ptzAssert.notOk)(user);

                        case 10:
                        case 'end':
                            return _context7.stop();
                    }
                }
            }, _callee7, undefined);
        })));
        it('return user when correct password', _asyncToGenerator(regeneratorRuntime.mark(function _callee8() {
            var password, user;
            return regeneratorRuntime.wrap(function _callee8$(_context8) {
                while (1) {
                    switch (_context8.prev = _context8.next) {
                        case 0:
                            password = 'testeteste';
                            user = new _ptzUserDomain.User({
                                userName: 'angeloocana',
                                email: 'alanmarcell@live.com',
                                displayName: 'Angelo Ocana',
                                password: password
                            });
                            _context8.next = 4;
                            return userApp.hashPassword(user);

                        case 4:
                            user = _context8.sent;

                            (0, _sinon.stub)(userRepository, 'getByUserNameOrEmail').returns(user);
                            _context8.next = 8;
                            return userApp.authUser({
                                form: {
                                    userNameOrEmail: user.userName,
                                    password: password
                                },
                                authedUser: authedUser
                            });

                        case 8:
                            user = _context8.sent;

                            (0, _ptzAssert.ok)(user);
                            (0, _ptzAssert.emptyArray)(user.errors);

                        case 11:
                        case 'end':
                            return _context8.stop();
                    }
                }
            }, _callee8, undefined);
        })));
    });
    describe('getAuthToken', function () {
        it('add errors when invalid userName or Email', _asyncToGenerator(regeneratorRuntime.mark(function _callee9() {
            var userRepository, userApp, authToken;
            return regeneratorRuntime.wrap(function _callee9$(_context9) {
                while (1) {
                    switch (_context9.prev = _context9.next) {
                        case 0:
                            userRepository = new _UserRepositoryFake.UserRepositoryFake(null);
                            userApp = new _index.UserApp({ userRepository: userRepository });

                            (0, _sinon.spy)(userRepository, 'getByUserNameOrEmail');
                            _context9.next = 5;
                            return userApp.getAuthToken({
                                form: {
                                    userNameOrEmail: 'ln',
                                    password: 'testtest'
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
            }, _callee9, undefined);
        })));
        it('add error when invalid password', _asyncToGenerator(regeneratorRuntime.mark(function _callee10() {
            var userRepository, userApp, authToken;
            return regeneratorRuntime.wrap(function _callee10$(_context10) {
                while (1) {
                    switch (_context10.prev = _context10.next) {
                        case 0:
                            userRepository = new _UserRepositoryFake.UserRepositoryFake(null);
                            userApp = new _index.UserApp({ userRepository: userRepository });

                            (0, _sinon.spy)(userRepository, 'getByUserNameOrEmail');
                            _context10.next = 5;
                            return userApp.getAuthToken({
                                form: {
                                    userNameOrEmail: 'angeloocana',
                                    password: 't'
                                },
                                authedUser: authedUser
                            });

                        case 5:
                            authToken = _context10.sent;

                            (0, _ptzAssert.ok)(userRepository.getByUserNameOrEmail[notCalled], 'Do NOT call repository getByUserNameOrEmail()');
                            (0, _ptzAssert.notOk)(authToken.authToken, 'Do NOT Generate token');
                            (0, _ptzAssert.notOk)(authToken.user, 'DO NOT return user');
                            (0, _ptzAssert.notEmptyArray)(authToken.errors, 'return errors');

                        case 10:
                        case 'end':
                            return _context10.stop();
                    }
                }
            }, _callee10, undefined);
        })));
        it('generate token when correct password', _asyncToGenerator(regeneratorRuntime.mark(function _callee11() {
            var userRepository, userApp, user, authToken;
            return regeneratorRuntime.wrap(function _callee11$(_context11) {
                while (1) {
                    switch (_context11.prev = _context11.next) {
                        case 0:
                            userRepository = new _UserRepositoryFake.UserRepositoryFake(null);
                            userApp = new _index.UserApp({ userRepository: userRepository });
                            user = new _ptzUserDomain.User({
                                userName: 'lnsilva',
                                email: 'lucas.neris@globalpoints.com.br', displayName: 'Lucas Neris',
                                password: '123456'
                            });
                            _context11.next = 5;
                            return userApp.hashPassword(user);

                        case 5:
                            user = _context11.sent;

                            (0, _sinon.stub)(userRepository, 'getByUserNameOrEmail').returns(user);
                            _context11.next = 9;
                            return userApp.getAuthToken({
                                form: {
                                    userNameOrEmail: 'lnsilva',
                                    password: '123456'
                                },
                                authedUser: authedUser
                            });

                        case 9:
                            authToken = _context11.sent;

                            (0, _ptzAssert.ok)(authToken.authToken, 'Empty Token');
                            (0, _ptzAssert.ok)(authToken.user, 'no user');
                            (0, _ptzAssert.ok)(authToken.user.id, 'no user id');
                            (0, _ptzAssert.emptyArray)(authToken.errors, 'return errors');

                        case 14:
                        case 'end':
                            return _context11.stop();
                    }
                }
            }, _callee11, undefined);
        })));
        it('add errors when incorrect password', _asyncToGenerator(regeneratorRuntime.mark(function _callee12() {
            var userRepository, userApp, authToken;
            return regeneratorRuntime.wrap(function _callee12$(_context12) {
                while (1) {
                    switch (_context12.prev = _context12.next) {
                        case 0:
                            userRepository = new _UserRepositoryFake.UserRepositoryFake(null);
                            userApp = new _index.UserApp({ userRepository: userRepository });

                            (0, _sinon.stub)(userRepository, 'getByUserNameOrEmail').returns(null);
                            _context12.next = 5;
                            return userApp.getAuthToken({
                                form: {
                                    userNameOrEmail: 'lnsilva',
                                    password: '123456'
                                },
                                authedUser: authedUser
                            });

                        case 5:
                            authToken = _context12.sent;

                            (0, _ptzAssert.notOk)(authToken.authToken, 'do not generate token');
                            (0, _ptzAssert.notOk)(authToken.user, 'do not return user');
                            (0, _ptzAssert.contains)(authToken.errors, _ptzUserDomain.allErrors.ERROR_USERAPP_GETAUTHTOKEN_INVALID_USERNAME_OR_PASSWORD, 'return invalid userName, email or password error');

                        case 9:
                        case 'end':
                            return _context12.stop();
                    }
                }
            }, _callee12, undefined);
        })));
    });
    describe('verifyAuthToken', function () {
        var userApp, userRepository;
        beforeEach(function () {
            userRepository = new _UserRepositoryFake.UserRepositoryFake(null);
            userApp = new _index.UserApp({ userRepository: userRepository });
        });
        it('Invalid token throws exception', _asyncToGenerator(regeneratorRuntime.mark(function _callee13() {
            var hasError;
            return regeneratorRuntime.wrap(function _callee13$(_context13) {
                while (1) {
                    switch (_context13.prev = _context13.next) {
                        case 0:
                            hasError = false;
                            _context13.prev = 1;
                            _context13.next = 4;
                            return userApp.verifyAuthToken({
                                token: 'Invalid_Token',
                                authedUser: authedUser
                            });

                        case 4:
                            _context13.next = 9;
                            break;

                        case 6:
                            _context13.prev = 6;
                            _context13.t0 = _context13['catch'](1);

                            hasError = true;

                        case 9:
                            (0, _ptzAssert.ok)(hasError);

                        case 10:
                        case 'end':
                            return _context13.stop();
                    }
                }
            }, _callee13, undefined, [[1, 6]]);
        })));
        it('Valid token return user', _asyncToGenerator(regeneratorRuntime.mark(function _callee14() {
            var user, authToken, userByToken;
            return regeneratorRuntime.wrap(function _callee14$(_context14) {
                while (1) {
                    switch (_context14.prev = _context14.next) {
                        case 0:
                            user = new _ptzUserDomain.User({
                                userName: 'lnsilva',
                                email: 'lucas.neris@globalpoints.com.br',
                                displayName: 'Lucas Neris',
                                password: '123456'
                            });
                            _context14.next = 3;
                            return userApp.hashPassword(user);

                        case 3:
                            user = _context14.sent;

                            (0, _sinon.stub)(userRepository, 'getByUserNameOrEmail').returns(user);
                            _context14.next = 7;
                            return userApp.getAuthToken({
                                form: {
                                    userNameOrEmail: 'lnsilva',
                                    password: '123456'
                                },
                                authedUser: authedUser
                            });

                        case 7:
                            authToken = _context14.sent;

                            (0, _ptzAssert.ok)(authToken.authToken, 'Empty Token');
                            _context14.next = 11;
                            return userApp.verifyAuthToken({
                                token: authToken.authToken,
                                authedUser: authedUser
                            });

                        case 11:
                            userByToken = _context14.sent;

                            (0, _ptzAssert.equal)(userByToken.id, user.id, 'User Id dont match');
                            (0, _ptzAssert.equal)(userByToken.email, user.email, 'User Id dont match');
                            (0, _ptzAssert.equal)(userByToken.userName, user.userName, 'User Id dont match');
                            (0, _ptzAssert.equal)(userByToken.displayName, user.displayName, 'User Id dont match');

                        case 16:
                        case 'end':
                            return _context14.stop();
                    }
                }
            }, _callee14, undefined);
        })));
    });
    describe('updatePassword', function () {
        it('return error when wrong password');
        it('return error when invalid password');
        it('update');
    });
    describe('updatePasswordToken', function () {
        it('return error when wrong token');
        it('return error when invalid password');
        it('update');
    });
    describe('deleteUser', function () {
        it('return error when user not found');
        it('return error when authuser is not admin or the deleted user');
        it('delete');
    });
    describe('findUsers', function () {
        it('find');
    });
    describe('seed', function () {
        it('seed');
    });
});
//# sourceMappingURL=userApp.test.js.map
//# sourceMappingURL=userApp.test.js.map