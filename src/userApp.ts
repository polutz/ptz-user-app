import { compare, hash } from 'bcryptjs';
import dotenv from 'dotenv';
import { decode, encode } from 'jwt-simple';
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
} from 'ptz-user-domain';
// import { log } from 'ptz-log';
import * as V from 'ptz-validations';
import R from 'ramda';
dotenv.config();

export let tokenSecret = process.env.PASSWORD_SALT;
export let passwordSalt = process.env.PASSWORD_SALT;

export const pHash = R.curry((secret: string) => (user: string) => hash(user, secret));
export const cEncode = R.curry((secret: string) => (user: IUser) => encode(user, secret));
export const cDecode = R.curry((secret: string) => (user: IUser) => decode(user, secret));

export const createApp = (userAppArgs: IUserAppArgs): IUserApp => {
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

    if (userDb) userWithOtherUsers = func.updateUser ?
        func.updateUser(userDb, userWithOtherUsers) :
        updateUserFunc(userDb, userWithOtherUsers);

    const savedUser = await func.userRepository.save(userWithOtherUsers);
    return Promise.resolve(savedUser);
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

export const getAuthToken = R.curry(async (func: {
    authUserForm,
    authUser: any,
    encode
},
                                           args: IAuthUserArgs):
    Promise<IAuthToken> => {
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
    if (user == null) errors.push(allErrors.ERROR_USERAPP_GETAUTHTOKEN_INVALID_USERNAME_OR_PASSWORD);
    else authToken = func.encode(user);

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

    users.forEach(async user => await saveUser({ userRepository }, { userArgs: user, authedUser }));

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
