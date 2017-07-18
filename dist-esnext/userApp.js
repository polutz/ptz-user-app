import { allErrors, authUserForm, createUser, otherUsersWithSameUserNameOrEmail, updateUser, users as usersToSeed } from '@alanmarcell/ptz-user-domain';
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
export const createApp = (userAppArgs) => {
    getSalt();
    const userRepository = userAppArgs.userRepository;
    return {
        saveUser: saveUser(userRepository),
        findUsers: findUsers(userRepository),
        authUser: authUser(userRepository),
        getAuthToken: getAuthToken(userRepository),
        verifyAuthToken: verifyAuthToken(userRepository),
        updatePassword,
        updatePasswordToken,
        deleteUser,
        hashPassword,
        seed: seed(userRepository)
    };
};
export async function hashPassword(user) {
    if (!user.password)
        return Promise.resolve(user);
    if (!passwordSalt)
        throw new Error('passwordSalt not added to process.env.');
    user.passwordHash = await hash(user.password, passwordSalt);
    user.password = undefined;
    return Promise.resolve(user);
}
export const saveUser = R.curry(async (userRepository, args) => {
    args.userArgs.createdBy = args.authedUser;
    var user = createUser(args.userArgs);
    user = await hashPassword(user);
    if (!V.isValid(user))
        return Promise.resolve(user);
    const otherUsers = await userRepository.getOtherUsersWithSameUserNameOrEmail(user);
    user = otherUsersWithSameUserNameOrEmail(user, otherUsers);
    if (!V.isValid(user))
        return Promise.resolve(user);
    const userDb = await userRepository.getById(user.id);
    if (userDb)
        user = updateUser(userDb, user);
    user = await userRepository.save(user);
    return Promise.resolve(user);
});
export const findUsers = R.curry((userRepository, args) => {
    return userRepository.find(args.query, { limit: args.options.limit });
});
export const authUser = R.curry(async (userRepository, args) => {
    const { form } = args;
    const user = await userRepository.getByUserNameOrEmail(form.userNameOrEmail);
    if (!user)
        return Promise.resolve(null);
    const isPasswordCorrect = await compare(form.password, user.passwordHash);
    return Promise.resolve(isPasswordCorrect ? user : null);
});
export const getAuthToken = R.curry(async (userRepository, args) => {
    const form = authUserForm(args.form);
    var authToken = null;
    if (!V.isValid(form))
        return Promise.resolve({
            authToken,
            user: null,
            errors: form.errors
        });
    const user = await authUser(userRepository, args);
    const errors = [];
    if (user == null)
        errors.push(allErrors.ERROR_USERAPP_GETAUTHTOKEN_INVALID_USERNAME_OR_PASSWORD);
    else
        authToken = encode(user, tokenSecret);
    return Promise.resolve({
        authToken,
        user,
        errors
    });
});
// tslint:disable-next-line:max-line-length
export const verifyAuthToken = R.curry((userRepository, args) => {
    const user = decode(args.token, passwordSalt);
    return Promise.resolve(user);
});
export const seed = R.curry((repository, authedUser) => {
    const users = usersToSeed.allUsers;
    users.forEach(async (user) => await saveUser(repository, { userArgs: user, authedUser }));
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