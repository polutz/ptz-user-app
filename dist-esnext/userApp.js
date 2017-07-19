import { allErrors, authUserForm, createUser, otherUsersWithSameUserNameOrEmail, updateUser as updateUserFunc, users as usersToSeed } from '@alanmarcell/ptz-user-domain';
import * as V from 'ptz-validations';
import { compare, hash } from 'bcryptjs';
import { decode, encode } from 'jwt-simple';
import R from 'ramda';
export let tokenSecret = process.env.PASSWORD_SALT;
export let passwordSalt = process.env.PASSWORD_SALT;
const getSalt = () => {
    tokenSecret = process.env.PASSWORD_SALT;
    passwordSalt = process.env.PASSWORD_SALT;
};
export const pHash = R.curry((secret) => (user) => hash(user, secret));
export const pEcode = R.curry((secret) => (user) => encode(user, secret));
export const pDecode = R.curry((secret) => (user) => decode(user, secret));
export const createApp = (userAppArgs) => {
    getSalt();
    const userRepository = userAppArgs.userRepository;
    return {
        saveUser: saveUser({
            userRepository,
            hashPass: hashPassword(pHash(tokenSecret)),
            createUser,
            isValid: V.isValid,
            updateUser: updateUserFunc,
            otherUsersWithSameUserNameOrEmail
        }),
        findUsers: findUsers(userRepository.find),
        authUser: authUser(userRepository.getByUserNameOrEmail),
        getAuthToken: getAuthToken(authUserForm, authUser(userRepository.getByUserNameOrEmail), pEcode(tokenSecret)),
        verifyAuthToken: verifyAuthToken(pDecode(tokenSecret)),
        updatePassword,
        updatePasswordToken,
        deleteUser,
        hashPassword: hashPassword(pHash(tokenSecret)),
        seed: seed(userRepository)
    };
};
export const hashPassword = R.curry(async (hashArg, user) => {
    if (!user.password)
        return Promise.resolve(user);
    user.passwordHash = await hashArg(user.password);
    user.password = undefined;
    return Promise.resolve(user);
});
export const saveUser = R.curry(async (func, args) => {
    args.userArgs.createdBy = args.authedUser;
    var user = func.createUser ? func.createUser(args.userArgs) : createUser(args.userArgs);
    user = await func.hashPass(user);
    if (!func.isValid(user))
        return Promise.resolve(user);
    const otherUsers = await func.userRepository.getOtherUsersWithSameUserNameOrEmail(user);
    user = func.otherUsersWithSameUserNameOrEmail(user, otherUsers);
    if (!V.isValid(user))
        return Promise.resolve(user);
    const userDb = await func.userRepository.getById(user.id);
    if (userDb)
        user = func.updateUser(userDb, user);
    user = await func.userRepository.save(user);
    return Promise.resolve(user);
});
// tslint:disable-next-line:max-line-length
export const findUsers = R.curry(async (find, args) => find(args.query, { limit: args.options.limit }));
export const authUser = R.curry(async (getByUserNameOrEmail, args) => {
    const { form } = args;
    const user = await getByUserNameOrEmail(form.userNameOrEmail);
    if (!user)
        return Promise.resolve(null);
    const isPasswordCorrect = await compare(form.password, user.passwordHash);
    return Promise.resolve(isPasswordCorrect ? user : null);
});
export const getAuthToken = R.curry(async (authUserFormArg, authUserArg, encodeArgs, args) => {
    const form = authUserFormArg(args.form);
    var authToken = null;
    if (!V.isValid(form))
        return Promise.resolve({
            authToken,
            user: null,
            errors: form.errors
        });
    const user = await authUserArg(args);
    const errors = [];
    if (user == null)
        errors.push(allErrors.ERROR_USERAPP_GETAUTHTOKEN_INVALID_USERNAME_OR_PASSWORD);
    else
        authToken = encodeArgs(user);
    return Promise.resolve({
        authToken,
        user,
        errors
    });
});
// tslint:disable-next-line:max-line-length
export const verifyAuthToken = R.curry((decodeArgs, args) => {
    const user = decodeArgs(args.token);
    return Promise.resolve(user);
});
export const seed = R.curry((userRepository, authedUser) => {
    const users = usersToSeed.allUsers;
    users.forEach(async (user) => await saveUser({ userRepository }, { userArgs: user, authedUser }));
    return Promise.resolve(true);
});
export const updatePassword = (args) => {
    return Promise.resolve(false);
};
export const updatePasswordToken = (args) => {
    return Promise.resolve(false);
};
export const deleteUser = (args) => {
    return Promise.resolve(false);
};
//# sourceMappingURL=userApp.js.map