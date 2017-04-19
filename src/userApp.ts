import { compare, hash } from 'bcryptjs';
import { decode, encode } from 'jwt-simple';
import { BaseApp } from 'ptz-core-app';
import {
    AuthenticateUserForm,
    errors as allErrors,
    IAuthToken,
    ICreatedBy,
    IUser,
    IUserApp,
    IUserAppArgs,
    IUserAppIAuthenticateUserArgs,
    IUserAppIFindArgs,
    IUserAppIGetAuthTokenArgs,
    IUserAppISaveArgs,
    IUserAppIVerifyAuthTokenArgs,
    IUserArgs,
    IUserRepository,
    User,
    users
} from 'ptz-user-domain';

export default class UserApp extends BaseApp implements IUserApp {

    tokenSecret = process.env.PASSWORD_SALT;
    passwordSalt = process.env.PASSWORD_SALT;

    private userRepository: IUserRepository;

    constructor(userAppArgs: IUserAppArgs) {
        super(userAppArgs);
        this.userRepository = userAppArgs.userRepository;
    }

    async hashPassword(user: IUser): Promise<IUser> {
        if (!user.password)
            return Promise.resolve(user);

        if (!this.passwordSalt)
            throw new Error('passwordSalt not added to process.env.');

        user.passwordHash = await hash(user.password, this.passwordSalt);
        user.password = undefined;

        return Promise.resolve(user);
    }

    async save(args: IUserAppISaveArgs): Promise<IUser> {
        this.log('UserApp.save args:', args);

        args.userArgs.createdBy = args.createdBy;
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

        this.log('UserApp.save return:', user);
        return Promise.resolve(user);
    }

    find(args: IUserAppIFindArgs): Promise<IUser[]> {
        return this.userRepository.find(args.query, { limit: args.options.limit });
    }

    async authenticateUser(args: IUserAppIAuthenticateUserArgs): Promise<IUser> {
        const form = new AuthenticateUserForm(args.form);

        const user = await this.userRepository.getByUserNameOrEmail(form.userNameOrEmail);

        if (!user)
            return Promise.resolve(null);

        const isPasswordCorrect = await compare(form.password, user.passwordHash);
        return Promise.resolve(isPasswordCorrect ? user : null);
    }

    async getAuthToken(args: IUserAppIGetAuthTokenArgs): Promise<IAuthToken> {
        const user = await this.authenticateUser(args);

        var authToken = null;
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

    verifyAuthToken(args: IUserAppIVerifyAuthTokenArgs): Promise<User> {
        const user = decode(args.token, this.passwordSalt);
        return Promise.resolve(user);
    }

    async seed(): Promise<void> {
        this.log('seeding users', users.allUsers);
        const createdBy: ICreatedBy = {
            ip: '',
            dtCreated: new Date(),
            user: {
                displayName: 'Seed',
                id: 'ptz-user-app UserApp.seed()',
                email: '',
                userName: ''
            }
        };

        users.allUsers.forEach(async user => await this.save({ userArgs: user, createdBy }));
    }
}
