'use strict';

var _ptzUserDomain = require('@alanmarcell/ptz-user-domain');

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _ptzAssert = require('ptz-assert');

var _ptzValidations = require('ptz-validations');

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
var calledOnce = 'calledOnce',
    notCalled = 'notCalled';
var userRepository;
var userApp;
var passwordSalt = process.env.PASSWORD_SALT;
var saveUser;
beforeEach(function () {
    userRepository = (0, _UserRepositoryFake.createUserRepoFake)();
    (0, _sinon.spy)(userRepository, 'save');
    (0, _sinon.stub)(userRepository, 'getOtherUsersWithSameUserNameOrEmail').returns([]);
    saveUser = (0, _index.saveUser)({
        userRepository: userRepository,
        hashPass: (0, _index.hashPassword)((0, _index.pHash)(passwordSalt)),
        isValid: _ptzValidations.isValid,
        updateUser: _ptzUserDomain.updateUser, otherUsersWithSameUserNameOrEmail: _ptzUserDomain.otherUsersWithSameUserNameOrEmail
    });
    userApp = (0, _index.createApp)({ userRepository: userRepository });
});
describe('UserApp', function () {
    describe('saveUser', function () {
        describe('insert', function () {
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

                                saveUser = (0, _index.saveUser)({ userRepository: userRepository });
                                _context.next = 4;
                                return saveUser({ userArgs: userArgs, authedUser: authedUser });

                            case 4:
                                user = _context.sent;

                                (0, _ptzAssert.ok)(user.passwordHash, 'passwordHash not set');
                                (0, _ptzAssert.notOk)(user.password, 'password not empty');

                            case 7:
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
                                return saveUser({ userArgs: userArgs, authedUser: authedUser });

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
                var userArgs;
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
                                return saveUser({ userArgs: userArgs, authedUser: authedUser });

                            case 3:
                                (0, _ptzAssert.ok)(userRepository.save[calledOnce]);

                            case 4:
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
                                return saveUser({ userArgs: userArgs, authedUser: authedUser });

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
                var dbUser, userArgs, userSaved;
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                // spy(userRepository, 'save');
                                // stub(userRepository, 'getOtherUsersWithSameUserNameOrEmail').returns([]);
                                dbUser = {
                                    userName: 'angeloocana',
                                    email: 'angeloocana@gmail.com',
                                    displayName: 'Angelo Ocana'
                                };

                                (0, _sinon.stub)(userRepository, 'getById').returns(dbUser);
                                userArgs = {
                                    userName: 'angeloocana',
                                    email: 'angeloocana@gmail.com',
                                    displayName: 'Angelo Ocana Updated'
                                };
                                _context5.next = 5;
                                return saveUser({ userArgs: userArgs, authedUser: authedUser });

                            case 5:
                                userSaved = _context5.sent;

                                (0, _ptzAssert.ok)(userRepository.save[calledOnce]);
                                (0, _ptzAssert.equal)(userSaved.displayName, userArgs.displayName);

                            case 8:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, undefined);
            })));
        });
    });
    describe('authUser', function () {
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
                            user = (0, _ptzUserDomain.createUser)({
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
                            user = (0, _ptzUserDomain.createUser)({
                                userName: 'angeloocana',
                                email: 'alanmarcell@live.com',
                                displayName: 'Angelo Ocana',
                                password: password
                            });

                            (0, _sinon.stub)(userRepository, 'getByUserNameOrEmail').returns(user);
                            userApp = (0, _index.createApp)({ userRepository: userRepository });
                            _context8.next = 6;
                            return userApp.hashPassword(user);

                        case 6:
                            user = _context8.sent;
                            _context8.next = 9;
                            return userApp.authUser({
                                form: {
                                    userNameOrEmail: user.userName,
                                    password: password
                                },
                                authedUser: authedUser
                            });

                        case 9:
                            user = _context8.sent;

                            (0, _ptzAssert.ok)(user);
                            (0, _ptzAssert.emptyArray)(user.errors);

                        case 12:
                        case 'end':
                            return _context8.stop();
                    }
                }
            }, _callee8, undefined);
        })));
    });
    describe('getAuthToken', function () {
        it('add errors when invalid userName or Email', _asyncToGenerator(regeneratorRuntime.mark(function _callee9() {
            var authToken;
            return regeneratorRuntime.wrap(function _callee9$(_context9) {
                while (1) {
                    switch (_context9.prev = _context9.next) {
                        case 0:
                            (0, _sinon.spy)(userRepository, 'getByUserNameOrEmail');
                            _context9.next = 3;
                            return (0, _index.getAuthToken)({
                                authUserForm: _ptzUserDomain.authUserForm,
                                authUser: _index.authUser,
                                encode: (0, _index.cEncode)(_index.tokenSecret)
                            }, {
                                form: {
                                    userNameOrEmail: 'ln',
                                    password: 'testtest'
                                },
                                authedUser: authedUser
                            });

                        case 3:
                            authToken = _context9.sent;

                            (0, _ptzAssert.ok)(userRepository.getByUserNameOrEmail[notCalled], 'Do NOT call repository getByUserNameOrEmail()');
                            (0, _ptzAssert.notOk)(authToken.authToken, 'Do NOT Generate token');
                            (0, _ptzAssert.notOk)(authToken.user, 'DO NOT return user');
                            (0, _ptzAssert.notEmptyArray)(authToken.errors, 'return errors');

                        case 8:
                        case 'end':
                            return _context9.stop();
                    }
                }
            }, _callee9, undefined);
        })));
        it('add error when invalid password', _asyncToGenerator(regeneratorRuntime.mark(function _callee10() {
            var authToken;
            return regeneratorRuntime.wrap(function _callee10$(_context10) {
                while (1) {
                    switch (_context10.prev = _context10.next) {
                        case 0:
                            (0, _sinon.spy)(userRepository, 'getByUserNameOrEmail');
                            _context10.next = 3;
                            return userApp.getAuthToken({
                                form: {
                                    userNameOrEmail: 'angeloocana',
                                    password: 't'
                                },
                                authedUser: authedUser
                            });

                        case 3:
                            authToken = _context10.sent;

                            (0, _ptzAssert.ok)(userRepository.getByUserNameOrEmail[notCalled], 'Do NOT call repository getByUserNameOrEmail()');
                            (0, _ptzAssert.notOk)(authToken.authToken, 'Do NOT Generate token');
                            (0, _ptzAssert.notOk)(authToken.user, 'DO NOT return user');
                            (0, _ptzAssert.notEmptyArray)(authToken.errors, 'return errors');

                        case 8:
                        case 'end':
                            return _context10.stop();
                    }
                }
            }, _callee10, undefined);
        })));
        it('generate token when correct password', _asyncToGenerator(regeneratorRuntime.mark(function _callee11() {
            var user, authToken;
            return regeneratorRuntime.wrap(function _callee11$(_context11) {
                while (1) {
                    switch (_context11.prev = _context11.next) {
                        case 0:
                            user = (0, _ptzUserDomain.createUser)({
                                userName: 'lnsilva',
                                email: 'lucas.neris@globalpoints.com.br', displayName: 'Lucas Neris',
                                password: '123456'
                            });

                            (0, _sinon.stub)(userRepository, 'getByUserNameOrEmail').returns(user);
                            userApp = (0, _index.createApp)({ userRepository: userRepository });
                            _context11.next = 5;
                            return userApp.hashPassword(user);

                        case 5:
                            user = _context11.sent;
                            _context11.next = 8;
                            return userApp.getAuthToken({
                                form: {
                                    userNameOrEmail: 'lnsilva',
                                    password: '123456'
                                },
                                authedUser: authedUser
                            });

                        case 8:
                            authToken = _context11.sent;

                            (0, _ptzAssert.ok)(authToken.authToken, 'Empty Token');
                            (0, _ptzAssert.ok)(authToken.user, 'no user');
                            (0, _ptzAssert.ok)(authToken.user.id, 'no user id');
                            (0, _ptzAssert.emptyArray)(authToken.errors, 'return errors');

                        case 13:
                        case 'end':
                            return _context11.stop();
                    }
                }
            }, _callee11, undefined);
        })));
        it('add errors when incorrect password', _asyncToGenerator(regeneratorRuntime.mark(function _callee12() {
            var authToken;
            return regeneratorRuntime.wrap(function _callee12$(_context12) {
                while (1) {
                    switch (_context12.prev = _context12.next) {
                        case 0:
                            (0, _sinon.stub)(userRepository, 'getByUserNameOrEmail').returns(null);
                            _context12.next = 3;
                            return userApp.getAuthToken({
                                form: {
                                    userNameOrEmail: 'lnsilva',
                                    password: '123456'
                                },
                                authedUser: authedUser
                            });

                        case 3:
                            authToken = _context12.sent;

                            (0, _ptzAssert.notOk)(authToken.authToken, 'do not generate token');
                            (0, _ptzAssert.notOk)(authToken.user, 'do not return user');
                            (0, _ptzAssert.contains)(authToken.errors, _ptzUserDomain.allErrors.ERROR_USERAPP_GETAUTHTOKEN_INVALID_USERNAME_OR_PASSWORD, 'return invalid userName, email or password error');

                        case 7:
                        case 'end':
                            return _context12.stop();
                    }
                }
            }, _callee12, undefined);
        })));
    });
    describe('verifyAuthToken', function () {
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
                            user = (0, _ptzUserDomain.createUser)({
                                userName: 'lnsilva',
                                email: 'lucas.neris@globalpoints.com.br',
                                displayName: 'Lucas Neris',
                                password: '123456'
                            });

                            (0, _sinon.stub)(userRepository, 'getByUserNameOrEmail').returns(user);
                            userApp = (0, _index.createApp)({ userRepository: userRepository });
                            _context14.next = 5;
                            return userApp.hashPassword(user);

                        case 5:
                            user = _context14.sent;
                            _context14.next = 8;
                            return userApp.getAuthToken({
                                form: {
                                    userNameOrEmail: 'lnsilva',
                                    password: '123456'
                                },
                                authedUser: authedUser
                            });

                        case 8:
                            authToken = _context14.sent;

                            (0, _ptzAssert.ok)(authToken.authToken, 'Empty Token');
                            _context14.next = 12;
                            return userApp.verifyAuthToken({
                                token: authToken.authToken,
                                authedUser: authedUser
                            });

                        case 12:
                            userByToken = _context14.sent;

                            (0, _ptzAssert.equal)(userByToken.id, user.id, 'User Id dont match');
                            (0, _ptzAssert.equal)(userByToken.email, user.email, 'User Id dont match');
                            (0, _ptzAssert.equal)(userByToken.userName, user.userName, 'User Id dont match');
                            (0, _ptzAssert.equal)(userByToken.displayName, user.displayName, 'User Id dont match');

                        case 17:
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
        it('call repository', _asyncToGenerator(regeneratorRuntime.mark(function _callee15() {
            var dbUsers, query, options, users;
            return regeneratorRuntime.wrap(function _callee15$(_context15) {
                while (1) {
                    switch (_context15.prev = _context15.next) {
                        case 0:
                            dbUsers = [{ name: 'teste' }];

                            (0, _sinon.stub)(userRepository, 'find').returns(dbUsers);
                            userApp = (0, _index.createApp)({ userRepository: userRepository });
                            query = {};
                            options = { limit: 4 };
                            _context15.next = 7;
                            return userApp.findUsers({ authedUser: authedUser, options: options, query: query });

                        case 7:
                            users = _context15.sent;

                            (0, _ptzAssert.ok)(userRepository.find[calledOnce]);
                            (0, _ptzAssert.equal)(users, dbUsers, 'users not returned');

                        case 10:
                        case 'end':
                            return _context15.stop();
                    }
                }
            }, _callee15, undefined);
        })));
    });
    describe('seed', function () {
        it.skip('default users', _asyncToGenerator(regeneratorRuntime.mark(function _callee16() {
            var seeded;
            return regeneratorRuntime.wrap(function _callee16$(_context16) {
                while (1) {
                    switch (_context16.prev = _context16.next) {
                        case 0:
                            _context16.next = 2;
                            return userApp.seed(authedUser);

                        case 2:
                            seeded = _context16.sent;

                            (0, _ptzAssert.ok)(seeded);

                        case 4:
                        case 'end':
                            return _context16.stop();
                    }
                }
            }, _callee16, undefined);
        })));
        it('custom users');
    });
});
//# sourceMappingURL=userApp.test.js.map
//# sourceMappingURL=userApp.test.js.map