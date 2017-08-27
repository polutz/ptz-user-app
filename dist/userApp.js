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
const hashPassword = exports.hashPassword = _ramda2.default.curry(async (hashArg, user) => {
    if (!user.password) return Promise.resolve(user);
    user.passwordHash = await hashArg(user.password);
    user.password = undefined;
    return Promise.resolve(user);
});
const saveUser = exports.saveUser = _ramda2.default.curry(async (func, args) => {
    args.userArgs.createdBy = args.authedUser;
    const user = func.createUser ? func.createUser(args.userArgs) : (0, _ptzUserDomain.createUser)(args.userArgs);
    const userHash = func.hashPass ? await func.hashPass(user) : await hashPassword(pHash(tokenSecret), user);
    if (func.isValid ? !func.isValid(userHash) : !V.isValid(userHash)) return Promise.resolve(userHash);
    const otherUsers = await func.userRepository.getOtherUsersWithSameUserNameOrEmail(userHash);
    var userWithOtherUsers = func.otherUsersWithSameUserNameOrEmail ? func.otherUsersWithSameUserNameOrEmail(userHash, otherUsers) : (0, _ptzUserDomain.otherUsersWithSameUserNameOrEmail)(userHash, otherUsers);
    if (func.isValid ? !func.isValid(userWithOtherUsers) : !V.isValid(userWithOtherUsers)) return Promise.resolve(userWithOtherUsers);
    const userDb = await func.userRepository.getById(userWithOtherUsers.id);
    if (userDb) userWithOtherUsers = func.updateUser ? func.updateUser(userDb, userWithOtherUsers) : (0, _ptzUserDomain.updateUser)(userDb, userWithOtherUsers);
    const savedUser = await func.userRepository.save(userWithOtherUsers);
    return Promise.resolve(savedUser);
});
// tslint:disable-next-line:max-line-length
const findUsers = exports.findUsers = _ramda2.default.curry(async (find, args) => find(args.query, { limit: args.options.limit }));
const authUser = exports.authUser = _ramda2.default.curry(async (getByUserNameOrEmail, args) => {
    const { form } = args;
    const user = await getByUserNameOrEmail(form.userNameOrEmail);
    if (!user) return Promise.resolve(null);
    const isPasswordCorrect = await (0, _bcryptjs.compare)(form.password, user.passwordHash);
    return Promise.resolve(isPasswordCorrect ? user : null);
});
const getAuthToken = exports.getAuthToken = _ramda2.default.curry(async (func, args) => {
    const form = func.authUserForm(args.form);
    var authToken = null;
    if (!V.isValid(form)) return Promise.resolve({
        authToken,
        user: null,
        errors: form.errors
    });
    const user = await func.authUser(args);
    const errors = [];
    if (user == null) errors.push(_ptzUserDomain.allErrors.ERROR_USERAPP_GETAUTHTOKEN_INVALID_USERNAME_OR_PASSWORD);else authToken = func.encode(user);
    return Promise.resolve({
        authToken,
        user,
        errors
    });
});
// tslint:disable-next-line:max-line-length
const verifyAuthToken = exports.verifyAuthToken = _ramda2.default.curry((decodeArgs, args) => {
    const user = decodeArgs(args.token);
    return Promise.resolve(user);
});
const seed = exports.seed = _ramda2.default.curry((userRepository, authedUser) => {
    const users = _ptzUserDomain.users.allUsers;
    users.forEach(async user => await saveUser({ userRepository }, { userArgs: user, authedUser }));
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