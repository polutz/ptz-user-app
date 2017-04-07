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
import { User, users } from 'ptz-user-domain';
export default class UserApp {
    constructor(userRepository) {
        this.tokenSecret = process.env.PASSWORD_SALT;
        this.passwordSalt = process.env.PASSWORD_SALT;
        this.userRepository = userRepository;
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
    save(userArgs) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('save userArgs:', userArgs);
            var user = new User(userArgs);
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
            console.log('return user:', user);
            return Promise.resolve(user);
        });
    }
    find(query, { limit }) {
        return this.userRepository.find(query, { limit });
    }
    authenticateUser(userNameOrEmail, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.getByUserNameOrEmail(userNameOrEmail);
            const userError = User.getUserAthenticationError(userNameOrEmail);
            if (!user)
                return Promise.resolve(userError);
            const res = yield compare(password, user.passwordHash);
            if (res)
                return Promise.resolve(user);
            else
                return Promise.resolve(userError);
        });
    }
    getAuthToken(userNameOrEmail, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.authenticateUser(userNameOrEmail, password);
            if (user.isValid())
                user.accessToken = encode(user, this.tokenSecret);
            return Promise.resolve(user);
        });
    }
    verifyAuthToken(token) {
        const user = decode(token, this.passwordSalt);
        return Promise.resolve(user);
    }
    seed() {
        users.allUsers.forEach(user => this.userRepository.save(user));
    }
}
//# sourceMappingURL=userApp.js.map