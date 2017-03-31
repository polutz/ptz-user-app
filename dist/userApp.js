'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bcryptjs = require('bcryptjs');

var _jwtSimple = require('jwt-simple');

var _ptzUserDomain = require('ptz-user-domain');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

var UserApp = function () {
    function UserApp(userRepository) {
        _classCallCheck(this, UserApp);

        this.tokenSecret = process.env.PASSWORD_SALT;
        this.passwordSalt = process.env.PASSWORD_SALT;
        this.userRepository = userRepository;
    }

    _createClass(UserApp, [{
        key: 'hashPassword',
        value: function hashPassword(user) {
            return __awaiter(this, void 0, void 0, regeneratorRuntime.mark(function _callee() {
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
                                if (this.passwordSalt) {
                                    _context.next = 4;
                                    break;
                                }

                                throw new Error('passwordSalt not added to process.env.');

                            case 4:
                                _context.next = 6;
                                return (0, _bcryptjs.hash)(user.password, this.passwordSalt);

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
        }
    }, {
        key: 'save',
        value: function save(userArgs) {
            return __awaiter(this, void 0, void 0, regeneratorRuntime.mark(function _callee2() {
                var user, otherUsers, userDb;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                user = new _ptzUserDomain.User(userArgs);
                                _context2.next = 3;
                                return this.hashPassword(user);

                            case 3:
                                user = _context2.sent;

                                if (user.isValid()) {
                                    _context2.next = 6;
                                    break;
                                }

                                return _context2.abrupt('return', Promise.resolve(user));

                            case 6:
                                _context2.next = 8;
                                return this.userRepository.getOtherUsersWithSameUserNameOrEmail(user);

                            case 8:
                                otherUsers = _context2.sent;

                                if (!user.otherUsersWithSameUserNameOrEmail(otherUsers)) {
                                    _context2.next = 11;
                                    break;
                                }

                                return _context2.abrupt('return', Promise.resolve(user));

                            case 11:
                                _context2.next = 13;
                                return this.userRepository.getById(user.id);

                            case 13:
                                userDb = _context2.sent;

                                if (userDb) user = userDb.update(user);
                                _context2.next = 17;
                                return this.userRepository.save(user);

                            case 17:
                                user = _context2.sent;
                                return _context2.abrupt('return', Promise.resolve(user));

                            case 19:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));
        }
    }, {
        key: 'find',
        value: function find(query, _ref) {
            var limit = _ref.limit;

            return this.userRepository.find(query, { limit: limit });
        }
    }, {
        key: 'authenticateUser',
        value: function authenticateUser(userNameOrEmail, password) {
            return __awaiter(this, void 0, void 0, regeneratorRuntime.mark(function _callee3() {
                var user, userError, res;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.userRepository.getByUserNameOrEmail(userNameOrEmail);

                            case 2:
                                user = _context3.sent;
                                userError = _ptzUserDomain.User.getUserAthenticationError(userNameOrEmail);

                                if (user) {
                                    _context3.next = 6;
                                    break;
                                }

                                return _context3.abrupt('return', Promise.resolve(userError));

                            case 6:
                                _context3.next = 8;
                                return (0, _bcryptjs.compare)(password, user.passwordHash);

                            case 8:
                                res = _context3.sent;

                                if (!res) {
                                    _context3.next = 13;
                                    break;
                                }

                                return _context3.abrupt('return', Promise.resolve(user));

                            case 13:
                                return _context3.abrupt('return', Promise.resolve(userError));

                            case 14:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));
        }
    }, {
        key: 'getAuthToken',
        value: function getAuthToken(userNameOrEmail, password) {
            return __awaiter(this, void 0, void 0, regeneratorRuntime.mark(function _callee4() {
                var user;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this.authenticateUser(userNameOrEmail, password);

                            case 2:
                                user = _context4.sent;

                                if (user.isValid()) user.accessToken = (0, _jwtSimple.encode)(user, this.tokenSecret);
                                return _context4.abrupt('return', Promise.resolve(user));

                            case 5:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));
        }
    }, {
        key: 'verifyAuthToken',
        value: function verifyAuthToken(token) {
            var user = (0, _jwtSimple.decode)(token, this.passwordSalt);
            return Promise.resolve(user);
        }
    }]);

    return UserApp;
}();

exports.default = UserApp;