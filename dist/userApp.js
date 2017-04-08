'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bcryptjs = require('bcryptjs');

var _jwtSimple = require('jwt-simple');

var _ptzCoreApp = require('ptz-core-app');

var _ptzUserDomain = require('ptz-user-domain');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

var UserApp = function (_BaseApp) {
    _inherits(UserApp, _BaseApp);

    function UserApp(userAppArgs) {
        _classCallCheck(this, UserApp);

        var _this = _possibleConstructorReturn(this, (UserApp.__proto__ || Object.getPrototypeOf(UserApp)).call(this, userAppArgs));

        _this.tokenSecret = process.env.PASSWORD_SALT;
        _this.passwordSalt = process.env.PASSWORD_SALT;
        _this.userRepository = userAppArgs.userRepository;
        return _this;
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
                                this.log('UserApp.save userArgs:', userArgs);
                                user = new _ptzUserDomain.User(userArgs);
                                _context2.next = 4;
                                return this.hashPassword(user);

                            case 4:
                                user = _context2.sent;

                                if (user.isValid()) {
                                    _context2.next = 7;
                                    break;
                                }

                                return _context2.abrupt('return', Promise.resolve(user));

                            case 7:
                                _context2.next = 9;
                                return this.userRepository.getOtherUsersWithSameUserNameOrEmail(user);

                            case 9:
                                otherUsers = _context2.sent;

                                if (!user.otherUsersWithSameUserNameOrEmail(otherUsers)) {
                                    _context2.next = 12;
                                    break;
                                }

                                return _context2.abrupt('return', Promise.resolve(user));

                            case 12:
                                _context2.next = 14;
                                return this.userRepository.getById(user.id);

                            case 14:
                                userDb = _context2.sent;

                                if (userDb) user = userDb.update(user);
                                _context2.next = 18;
                                return this.userRepository.save(user);

                            case 18:
                                user = _context2.sent;

                                this.log('UserApp.save return:', user);
                                return _context2.abrupt('return', Promise.resolve(user));

                            case 21:
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
    }, {
        key: 'seed',
        value: function seed() {
            return __awaiter(this, void 0, void 0, regeneratorRuntime.mark(function _callee6() {
                var _this2 = this;

                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                this.log('seeding users =============>', _ptzUserDomain.users.allUsers);
                                _ptzUserDomain.users.allUsers.forEach(function (user) {
                                    return __awaiter(_this2, void 0, void 0, regeneratorRuntime.mark(function _callee5() {
                                        return regeneratorRuntime.wrap(function _callee5$(_context5) {
                                            while (1) {
                                                switch (_context5.prev = _context5.next) {
                                                    case 0:
                                                        _context5.next = 2;
                                                        return this.save(user);

                                                    case 2:
                                                        return _context5.abrupt('return', _context5.sent);

                                                    case 3:
                                                    case 'end':
                                                        return _context5.stop();
                                                }
                                            }
                                        }, _callee5, this);
                                    }));
                                });

                            case 2:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));
        }
    }]);

    return UserApp;
}(_ptzCoreApp.BaseApp);
//# sourceMappingURL=userApp.js.map


exports.default = UserApp;