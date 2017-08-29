'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.deleteUser = exports.updatePasswordToken = exports.updatePassword = exports.seed = exports.verifyAuthToken = exports.getAuthToken = exports.authUser = exports.findUsers = exports.saveUser = exports.hashPassword = exports.createApp = exports.cDecode = exports.cEncode = exports.pHash = exports.passwordSalt = exports.tokenSecret = undefined;

var _bcryptjs = require('bcryptjs');

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _jwtSimple = require('jwt-simple');

var _ptzUserDomain = require('ptz-user-domain');

var _ptzValidations = require('ptz-validations');

var V = _interopRequireWildcard(_ptzValidations);

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
// import { log } from 'ptz-log';


_dotenv2.default.config();
let tokenSecret = exports.tokenSecret = process.env.PASSWORD_SALT;
let passwordSalt = exports.passwordSalt = process.env.PASSWORD_SALT;
const pHash = exports.pHash = _ramda2.default.curry(secret => user => (0, _bcryptjs.hash)(user, secret));
const cEncode = exports.cEncode = _ramda2.default.curry(secret => user => (0, _jwtSimple.encode)(user, secret));
const cDecode = exports.cDecode = _ramda2.default.curry(secret => user => (0, _jwtSimple.decode)(user, secret));
const createApp = exports.createApp = userAppArgs => {
    const userRepository = userAppArgs.userRepository;
    return {
        saveUser: saveUser({
            userRepository,
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
            encode: cEncode(tokenSecret)
        }),
        verifyAuthToken: verifyAuthToken(cDecode(tokenSecret)),
        updatePassword,
        updatePasswordToken,
        deleteUser,
        hashPassword: hashPassword(pHash(tokenSecret)),
        seed: seed(userRepository)
    };
};
const hashPassword = exports.hashPassword = _ramda2.default.curry((() => {
    var _ref = _asyncToGenerator(function* (hashArg, user) {
        if (!user.password) return Promise.resolve(user);
        user.passwordHash = yield hashArg(user.password);
        user.password = undefined;
        return Promise.resolve(user);
    });

    return function (_x, _x2) {
        return _ref.apply(this, arguments);
    };
})());
const saveUser = exports.saveUser = _ramda2.default.curry((() => {
    var _ref2 = _asyncToGenerator(function* (func, args) {
        args.userArgs.createdBy = args.authedUser;
        const user = func.createUser ? func.createUser(args.userArgs) : (0, _ptzUserDomain.createUser)(args.userArgs);
        const userHash = func.hashPass ? yield func.hashPass(user) : yield hashPassword(pHash(tokenSecret), user);
        if (func.isValid ? !func.isValid(userHash) : !V.isValid(userHash)) return Promise.resolve(userHash);
        const otherUsers = yield func.userRepository.getOtherUsersWithSameUserNameOrEmail(userHash);
        var userWithOtherUsers = func.otherUsersWithSameUserNameOrEmail ? func.otherUsersWithSameUserNameOrEmail(userHash, otherUsers) : (0, _ptzUserDomain.otherUsersWithSameUserNameOrEmail)(userHash, otherUsers);
        if (func.isValid ? !func.isValid(userWithOtherUsers) : !V.isValid(userWithOtherUsers)) return Promise.resolve(userWithOtherUsers);
        const userDb = yield func.userRepository.getById(userWithOtherUsers.id);
        if (userDb) userWithOtherUsers = func.updateUser ? func.updateUser(userDb, userWithOtherUsers) : (0, _ptzUserDomain.updateUser)(userDb, userWithOtherUsers);
        const savedUser = yield func.userRepository.save(userWithOtherUsers);
        return Promise.resolve(savedUser);
    });

    return function (_x3, _x4) {
        return _ref2.apply(this, arguments);
    };
})());
// tslint:disable-next-line:max-line-length
const findUsers = exports.findUsers = _ramda2.default.curry((() => {
    var _ref3 = _asyncToGenerator(function* (find, args) {
        return find(args.query, { limit: args.options.limit });
    });

    return function (_x5, _x6) {
        return _ref3.apply(this, arguments);
    };
})());
const authUser = exports.authUser = _ramda2.default.curry((() => {
    var _ref4 = _asyncToGenerator(function* (getByUserNameOrEmail, args) {
        const form = args.form;

        const user = yield getByUserNameOrEmail(form.userNameOrEmail);
        if (!user) return Promise.resolve(null);
        const isPasswordCorrect = yield (0, _bcryptjs.compare)(form.password, user.passwordHash);
        return Promise.resolve(isPasswordCorrect ? user : null);
    });

    return function (_x7, _x8) {
        return _ref4.apply(this, arguments);
    };
})());
const getAuthToken = exports.getAuthToken = _ramda2.default.curry((() => {
    var _ref5 = _asyncToGenerator(function* (func, args) {
        const form = func.authUserForm(args.form);
        var authToken = null;
        if (!V.isValid(form)) return Promise.resolve({
            authToken,
            user: null,
            errors: form.errors
        });
        const user = yield func.authUser(args);
        const errors = [];
        if (user == null) errors.push(_ptzUserDomain.allErrors.ERROR_USERAPP_GETAUTHTOKEN_INVALID_USERNAME_OR_PASSWORD);else authToken = func.encode(user);
        return Promise.resolve({
            authToken,
            user,
            errors
        });
    });

    return function (_x9, _x10) {
        return _ref5.apply(this, arguments);
    };
})());
// tslint:disable-next-line:max-line-length
const verifyAuthToken = exports.verifyAuthToken = _ramda2.default.curry((decodeArgs, args) => {
    const user = decodeArgs(args.token);
    return Promise.resolve(user);
});
const seed = exports.seed = _ramda2.default.curry((userRepository, authedUser) => {
    const users = _ptzUserDomain.users.allUsers;
    users.forEach((() => {
        var _ref6 = _asyncToGenerator(function* (user) {
            return yield saveUser({ userRepository }, { userArgs: user, authedUser });
        });

        return function (_x11) {
            return _ref6.apply(this, arguments);
        };
    })());
    return Promise.resolve(true);
});
const updatePassword = exports.updatePassword = args => {
    return Promise.resolve(false);
};
const updatePasswordToken = exports.updatePasswordToken = args => {
    return Promise.resolve(false);
};
const deleteUser = exports.deleteUser = args => {
    return Promise.resolve(false);
};
//# sourceMappingURL=userApp.js.map
//# sourceMappingURL=userApp.js.map