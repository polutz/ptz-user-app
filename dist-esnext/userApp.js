import { compare, hash } from 'bcryptjs';
import { decode, encode } from 'jwt-simple';
import { BaseApp } from 'ptz-core-app';
import { allErrors, AuthUserForm, User, users } from 'ptz-user-domain';
export default class UserApp extends BaseApp {
    constructor(userAppArgs) {
        super(userAppArgs);
        // TODO: Actions
        // static actions = {
        //     SAVE: 'USER_APP_SAVE',
        //     GET_AUTH_TOKEN: 'GET_AUTH_TOKEN'
        // };
        this.tokenSecret = process.env.PASSWORD_SALT;
        this.passwordSalt = process.env.PASSWORD_SALT;
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
    async hashPassword(user) {
        if (!user.password)
            return Promise.resolve(user);
        if (!this.passwordSalt)
            throw new Error('passwordSalt not added to process.env.');
        user.passwordHash = await hash(user.password, this.passwordSalt);
        user.password = undefined;
        return Promise.resolve(user);
    }
    async saveUser(args) {
        args.userArgs.createdBy = args.authedUser;
        var user = new User(args.userArgs);
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
    findUsers(args) {
        return this.userRepository.find(args.query, { limit: args.options.limit });
    }
    async authUser(args) {
        const { form } = args;
        const user = await this.userRepository.getByUserNameOrEmail(form.userNameOrEmail);
        if (!user)
            return Promise.resolve(null);
        const isPasswordCorrect = await compare(form.password, user.passwordHash);
        return Promise.resolve(isPasswordCorrect ? user : null);
    }
    async getAuthToken(args) {
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
    verifyAuthToken(args) {
        const user = decode(args.token, this.passwordSalt);
        return Promise.resolve(user);
    }
    async seed() {
        this.log('seeding users', users.allUsers);
        const authedUser = {
            ip: '',
            dtCreated: new Date(),
            user: {
                displayName: 'Seed',
                id: 'ptz-user-app UserApp.seed()',
                email: '',
                userName: ''
            }
        };
        users.allUsers.forEach(async (user) => await this.saveUser({ userArgs: user, authedUser }));
    }
    async updatePassword(args) {
        return Promise.resolve(false);
    }
    async updatePasswordToken(args) {
        return Promise.resolve(false);
    }
    async deleteUser(args) {
        return Promise.resolve(false);
    }
}
//# sourceMappingURL=userApp.js.map