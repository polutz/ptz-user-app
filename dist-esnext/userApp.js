import { allErrors, authUserForm, createUser, otherUsersWithSameUserNameOrEmail, updateUser as updateUserFunc, users as usersToSeed } from '@alanmarcell/ptz-user-domain';
import { compare, hash } from 'bcryptjs';
import dotenv from 'dotenv';
import { decode, encode } from 'jwt-simple';
// import { log } from 'ptz-log';
import * as V from 'ptz-validations';
import R from 'ramda';
dotenv.config();
export let tokenSecret = process.env.PASSWORD_SALT;
export let passwordSalt = process.env.PASSWORD_SALT;
export const pHash = R.curry((secret) => (user) => hash(user, secret));
export const pEcode = R.curry((secret) => (user) => encode(user, secret));
export const pDecode = R.curry((secret) => (user) => decode(user, secret));
export const createApp = (userAppArgs) => {
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
        getAuthToken: getAuthToken({
            authUserForm,
            authUser: authUser(userRepository.getByUserNameOrEmail),
            encode: pEcode(tokenSecret)
        }),
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
    const user = func.createUser ? func.createUser(args.userArgs) : createUser(args.userArgs);
    const userHash = func.hashPass ? await func.hashPass(user) : await hashPassword(pHash(tokenSecret), user);
    if (func.isValid ? !func.isValid(userHash) : !V.isValid(userHash))
        return Promise.resolve(userHash);
    const otherUsers = await func.userRepository.getOtherUsersWithSameUserNameOrEmail(userHash);
    var userWithOtherUsers = func.otherUsersWithSameUserNameOrEmail ?
        func.otherUsersWithSameUserNameOrEmail(userHash, otherUsers) :
        otherUsersWithSameUserNameOrEmail(userHash, otherUsers);
    if (func.isValid ? !func.isValid(userWithOtherUsers) : !V.isValid(userWithOtherUsers))
        return Promise.resolve(userWithOtherUsers);
    const userDb = await func.userRepository.getById(userWithOtherUsers.id);
    if (userDb)
        userWithOtherUsers = func.updateUser ?
            func.updateUser(userDb, userWithOtherUsers) :
            updateUserFunc(userDb, userWithOtherUsers);
    const savedUser = await func.userRepository.save(userWithOtherUsers);
    return Promise.resolve(savedUser);
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
export const getAuthToken = R.curry(async (func, args) => {
    const form = func.authUserForm(args.form);
    var authToken = null;
    if (!V.isValid(form))
        return Promise.resolve({
            authToken,
            user: null,
            errors: form.errors
        });
    const user = await func.authUser(args);
    const errors = [];
    if (user == null)
        errors.push(allErrors.ERROR_USERAPP_GETAUTHTOKEN_INVALID_USERNAME_OR_PASSWORD);
    else
        authToken = func.encode(user);
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