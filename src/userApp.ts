import { compare, hash } from 'bcryptjs';
import { decode, encode } from 'jwt-simple';
import { BaseApp } from 'ptz-core-app';
import {
    allErrors,
    AuthUserForm,
    IAuthToken,
    IAuthUserArgs,
    ICreatedBy,
    IDeleteUserArgs,
    IFindUsersArgs,
    ISaveUserArgs,
    IUpdatePasswordArgs,
    IUpdatePasswordTokenArgs,
    IUser,
    IUserApp,
    IUserAppArgs,
    IUserRepository,
    IVerifyAuthTokenArgs,
    User,
    users
} from 'ptz-user-domain';

export default class UserApp extends BaseApp implements IUserApp {

    // TODO: Actions
    // static actions = {
    //     SAVE: 'USER_APP_SAVE',
    //     GET_AUTH_TOKEN: 'GET_AUTH_TOKEN'
    // };

    tokenSecret = process.env.PASSWORD_SALT;
    passwordSalt = process.env.PASSWORD_SALT;

    private userRepository: IUserRepository;

    constructor(userAppArgs: IUserAppArgs) {
        super(userAppArgs);
        this.userRepository = userAppArgs.userRepository;
    }

    // TODO: Actions
    // async execAction(action) {
    //     switch (action.type) {
    //         case UserApp.actions.SAVE:
    //             return await this.saveUser(action.args);
    //         case UserApp.actions.GET_AUTH_TOKEN:
    //             return await this.getAuthToken(action.args);
    //     }
    // }

    async hashPassword(user: IUser): Promise<IUser> {
        if (!user.password)
            return Promise.resolve(user);

        if (!this.passwordSalt)
            throw new Error('passwordSalt not added to process.env.');

        user.passwordHash = await hash(user.password, this.passwordSalt);
        user.password = undefined;

        return Promise.resolve(user);
    }

    async saveUser(args: ISaveUserArgs): Promise<IUser> {
        args.userArgs.createdBy = args.authedUser;
        var user: IUser = new User(args.userArgs);

        user = await this.hashPassword(user);

        if (!user.isValid())
            return Promise.resolve(user);

        const otherUsers = await this.userRepository.getOtherUsersWithSameUserNameOrEmail(user);

        if (user.otherUsersWithSameUserNameOrEmail(otherUsers))
            return Promise.resolve(user);

        const userDb = await this.userRepository.getById(user.id);

        if (userDb)
            user = userDb.update(user);

        user = await this.userRepository.save(user);

        return Promise.resolve(user);
    }

    findUsers(args: IFindUsersArgs): Promise<IUser[]> {
        return this.userRepository.find(args.query, { limit: args.options.limit });
    }

    async authUser(args: IAuthUserArgs): Promise<IUser> {
        const { form } = args;
        const user = await this.userRepository.getByUserNameOrEmail(form.userNameOrEmail);

        if (!user)
            return Promise.resolve(null);

        const isPasswordCorrect = await compare(form.password, user.passwordHash);
        return Promise.resolve(isPasswordCorrect ? user : null);
    }

    async getAuthToken(args: IAuthUserArgs): Promise<IAuthToken> {
        const form = new AuthUserForm(args.form);
        var authToken = null;

        if (!form.isValid())
            return Promise.resolve({
                authToken,
                user: null,
                errors: form.errors
            });

        const user = await this.authUser(args);

        const errors = [];

        if (user == null)
            errors.push(allErrors.ERROR_USERAPP_GETAUTHTOKEN_INVALID_USERNAME_OR_PASSWORD);
        else
            authToken = encode(user, this.tokenSecret);

        return Promise.resolve({
            authToken,
            user,
            errors
        });
    }

    verifyAuthToken(args: IVerifyAuthTokenArgs): Promise<User> {
        const user = decode(args.token, this.passwordSalt);
        return Promise.resolve(user);
    }

    async seed(): Promise<void> {
        this.log('seeding users', users.allUsers);
        const authedUser: ICreatedBy = {
            ip: '',
            dtCreated: new Date(),
            user: {
                displayName: 'Seed',
                id: 'ptz-user-app UserApp.seed()',
                email: '',
                userName: ''
            }
        };

        users.allUsers.forEach(async user => await this.saveUser({ userArgs: user, authedUser }));
    }

    async updatePassword(args: IUpdatePasswordArgs): Promise<boolean> {
        return Promise.resolve(false);
    }

    async updatePasswordToken(args: IUpdatePasswordTokenArgs): Promise<boolean> {
        return Promise.resolve(false);
    }

    async deleteUser(args: IDeleteUserArgs): Promise<boolean> {
        return Promise.resolve(false);
    }
}
