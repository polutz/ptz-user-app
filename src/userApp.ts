import { compare, hash } from 'bcryptjs';
import { decode, encode } from 'jwt-simple';
import { IUser, IUserArgs, IUserApp, IUserRepository, User } from 'ptz-user-domain';

export default class UserApp implements IUserApp {

    tokenSecret = process.env.PASSWORD_SALT;
    passwordSalt = process.env.PASSWORD_SALT;
    private userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
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

    async save(userArgs: IUserArgs): Promise<IUser> {
        var user: IUser = new User(userArgs);

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

    find(query, { limit }) {
        return this.userRepository.find(query, { limit });
    }

    async authenticateUser(userNameOrEmail: string, password: string): Promise<IUser> {
        const user = await this.userRepository.getByUserNameOrEmail(userNameOrEmail);

        const userError = User.getUserAthenticationError(userNameOrEmail);

        if (!user)
            return Promise.resolve(userError);

        const res = await compare(password, user.passwordHash);

        if (res)
            return Promise.resolve(user);
        else
            return Promise.resolve(userError);
    }

    async getAuthToken(userNameOrEmail: string, password: string): Promise<IUser> {
        const user = await this.authenticateUser(userNameOrEmail, password);

        if (user.isValid())
            user.accessToken = encode(user, this.tokenSecret);

        return Promise.resolve(user);
    }

    verifyAuthToken(token: string): Promise<User> {
        const user = decode(token, this.passwordSalt);
        return Promise.resolve(user);
    }
}
