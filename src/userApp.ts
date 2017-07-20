import {
    allErrors,
    authUserForm,
    createUser,
    IAuthToken,
    IAuthUserArgs,
    ICreatedBy,
    IDeleteUserArgs,
    IFindUsersArgs,
    ISaveUserArgs,
    IUpdatePasswordArgs,
    IUpdatePasswordTokenArgs,
    IUser,
    IUserApp, IUserAppArgs,
    IUserRepository,
    IVerifyAuthTokenArgs,
    otherUsersWithSameUserNameOrEmail,
    updateUser as updateUserFunc,
    users as usersToSeed
} from '@alanmarcell/ptz-user-domain';

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
export const pHash = R.curry((secret: string) => (user: string) => hash(user, secret));
export const pEcode = R.curry((secret: string) => (user: IUser) => encode(user, secret));
export const pDecode = R.curry((secret: string) => (user: IUser) => decode(user, secret));

export const createApp = (userAppArgs: IUserAppArgs): IUserApp => {
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
        }
        ),
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

export const hashPassword = R.curry(async (hashArg: (userPassword: string) => any, user: IUser): Promise<IUser> => {
    if (!user.password) return Promise.resolve(user);

    user.passwordHash = await hashArg(user.password);
    user.password = undefined;

    return Promise.resolve(user);
});

export const saveUser = R.curry(async (func: {
    userRepository: IUserRepository,
    hashPass?: (u: IUser) => Promise<IUser>,
    createUser?: (u: IUser) => IUser,
    isValid?: (user: V.IHaveValidation) => boolean,
    updateUser?: (dbUser: IUser, user: IUser) => IUser,
    otherUsersWithSameUserNameOrEmail?: (user: IUser, otherUsers: IUser[]) => IUser
},
                                       args: ISaveUserArgs): Promise<IUser> => {
    args.userArgs.createdBy = args.authedUser;

    var user = func.createUser ? func.createUser(args.userArgs) : createUser(args.userArgs);

    user = await func.hashPass(user);
    if (!func.isValid(user))
        return Promise.resolve(user);

    const otherUsers = await func.userRepository.getOtherUsersWithSameUserNameOrEmail(user) ;

    user = func.otherUsersWithSameUserNameOrEmail(user, otherUsers);

    if (!V.isValid(user))
        return Promise.resolve(user);

    const userDb = await func.userRepository.getById(user.id);

    if (userDb) user = func.updateUser(userDb, user);

    user = await func.userRepository.save(user);

    return Promise.resolve(user);
});

// tslint:disable-next-line:max-line-length
export const findUsers = R.curry(async (find: (query: any, options: { limit: number }) => Promise<IUser[]>, args: IFindUsersArgs) =>
    find(args.query, { limit: args.options.limit }));

export const authUser = R.curry(async (getByUserNameOrEmail: (userNameOrEmail: string) => Promise<IUser>,
                                       args: IAuthUserArgs) => {
    const { form } = args;
    const user = await getByUserNameOrEmail(form.userNameOrEmail);

    if (!user) return Promise.resolve(null);

    const isPasswordCorrect = await compare(form.password, user.passwordHash);

    return Promise.resolve(isPasswordCorrect ? user : null);
});

export const getAuthToken = R.curry(async (authUserFormArg, authUserArg: any, encodeArgs, args: IAuthUserArgs):
    Promise<IAuthToken> => {
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
    if (user == null) errors.push(allErrors.ERROR_USERAPP_GETAUTHTOKEN_INVALID_USERNAME_OR_PASSWORD);
    else authToken = encodeArgs(user);

    return Promise.resolve({
        authToken,
        user,
        errors
    });
});

// tslint:disable-next-line:max-line-length
export const verifyAuthToken = R.curry((decodeArgs: any, args: IVerifyAuthTokenArgs): Promise<IUser> => {
    const user = decodeArgs(args.token);
    return Promise.resolve(user);
});

export const seed = R.curry((userRepository: IUserRepository, authedUser: ICreatedBy) => {

    const users: IUser[] = usersToSeed.allUsers;

    users.forEach(async user => await saveUser({userRepository}, { userArgs: user, authedUser }));

    return Promise.resolve(true);
});

export const updatePassword = (args: IUpdatePasswordArgs): Promise<boolean> => {
    return Promise.resolve(false);
};

export const updatePasswordToken = (args: IUpdatePasswordTokenArgs): Promise<boolean> => {
    return Promise.resolve(false);
};

export const deleteUser = (args: IDeleteUserArgs): Promise<boolean> => {
    return Promise.resolve(false);
};
