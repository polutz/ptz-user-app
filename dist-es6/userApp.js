var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { compare, hash } from 'bcryptjs';
import { decode, encode } from 'jwt-simple';
import { BaseApp } from 'ptz-core-app';
import { allErrors, AuthUserForm, User, users } from 'ptz-user-domain';
export default class UserApp extends BaseApp {
    constructor(userAppArgs) {
        super(userAppArgs);
        this.tokenSecret = process.env.PASSWORD_SALT;
        this.passwordSalt = process.env.PASSWORD_SALT;
        this.userRepository = userAppArgs.userRepository;
    }
    execAction(action) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (action.type) {
                case UserApp.actions.SAVE:
                    return yield this.saveUser(action.args);
                case UserApp.actions.GET_AUTH_TOKEN:
                    return yield this.getAuthToken(action.args);
            }
        });
    }
    hashPassword(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user.password)
                return Promise.resolve(user);
            if (!this.passwordSalt)
                throw new Error('passwordSalt not added to process.env.');
            user.passwordHash = yield hash(user.password, this.passwordSalt);
            user.password = undefined;
            return Promise.resolve(user);
        });
    }
    saveUser(args) {
        return __awaiter(this, void 0, void 0, function* () {
            args.userArgs.createdBy = args.authedUser;
            var user = new User(args.userArgs);
            user = yield this.hashPassword(user);
            if (!user.isValid())
                return Promise.resolve(user);
            const otherUsers = yield this.userRepository.getOtherUsersWithSameUserNameOrEmail(user);
            if (user.otherUsersWithSameUserNameOrEmail(otherUsers))
                return Promise.resolve(user);
            const userDb = yield this.userRepository.getById(user.id);
            if (userDb)
                user = userDb.update(user);
            user = yield this.userRepository.save(user);
            return Promise.resolve(user);
        });
    }
    findUsers(args) {
        return this.userRepository.find(args.query, { limit: args.options.limit });
    }
    authUser(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const { form } = args;
            const user = yield this.userRepository.getByUserNameOrEmail(form.userNameOrEmail);
            if (!user)
                return Promise.resolve(null);
            const isPasswordCorrect = yield compare(form.password, user.passwordHash);
            return Promise.resolve(isPasswordCorrect ? user : null);
        });
    }
    getAuthToken(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const form = new AuthUserForm(args.form);
            var authToken = null;
            if (!form.isValid())
                return Promise.resolve({
                    authToken,
                    user: null,
                    errors: form.errors
                });
            const user = yield this.authUser(args);
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
        });
    }
    verifyAuthToken(args) {
        const user = decode(args.token, this.passwordSalt);
        return Promise.resolve(user);
    }
    seed() {
        return __awaiter(this, void 0, void 0, function* () {
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
            users.allUsers.forEach((user) => __awaiter(this, void 0, void 0, function* () { return yield this.saveUser({ userArgs: user, authedUser }); }));
        });
    }
    updatePassword(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve(false);
        });
    }
    updatePasswordToken(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve(false);
        });
    }
    deleteUser(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve(false);
        });
    }
}
UserApp.actions = {
    SAVE: 'USER_APP_SAVE',
    GET_AUTH_TOKEN: 'GET_AUTH_TOKEN'
};
//# sourceMappingURL=userApp.js.map