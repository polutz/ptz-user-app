var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import dotenv from 'dotenv';
dotenv.config();
import { contains, emptyArray, equal, notOk, ok } from 'ptz-assert';
import { User } from 'ptz-user-domain';
import { spy, stub } from 'sinon';
import UserApp from './userApp';
import UserRepositoryFake from './UserRepositoryFake';
describe('UserApp', () => {
    describe('save', () => {
        var userApp, userRepository;
        beforeEach(() => {
            userRepository = new UserRepositoryFake(null);
            spy(userRepository, 'save');
            stub(userRepository, 'getOtherUsersWithSameUserNameOrEmail').returns([]);
            userApp = new UserApp(userRepository);
        });
        it('hash password', () => __awaiter(this, void 0, void 0, function* () {
            var user = {
                userName: 'angeloocana',
                email: 'angeloocana@gmail.com',
                displayName: 'Ângelo Ocanã',
                password: 'testPassword'
            };
            user = yield userApp.save(user);
            ok(user.passwordHash, 'passwordHash not set');
            notOk(user.password, 'password not empty');
        }));
        it('do not call repository if user is invalid', () => __awaiter(this, void 0, void 0, function* () {
            const user = {
                userName: '',
                email: '',
                displayName: ''
            };
            yield userApp.save(user);
            const notCalled = 'notCalled';
            ok(userRepository.save[notCalled]);
        }));
        it('call repository if User is valid', () => __awaiter(this, void 0, void 0, function* () {
            const user = {
                userName: 'angeloocana',
                email: 'angeloocana@gmail.com',
                displayName: ''
            };
            yield userApp.save(user);
            const calledOnce = 'calledOnce';
            ok(userRepository.save[calledOnce]);
        }));
    });
    describe('authenticateUser', () => {
        var userApp, userRepository;
        beforeEach(() => {
            userRepository = new UserRepositoryFake(null);
            userApp = new UserApp(userRepository);
        });
        it('User not found should return user with error', () => __awaiter(this, void 0, void 0, function* () {
            const userName = 'angeloocana';
            stub(userRepository, 'getByUserNameOrEmail').returns(null);
            const user = yield userApp.authenticateUser(userName, 'teste');
            contains(user.errors, 'ERROR_USER_INVALID_USERNAME_OR_PASSWORD');
        }));
        it('User found but incorrect password should return user with error', () => __awaiter(this, void 0, void 0, function* () {
            const password = 'testeteste';
            var user = new User({
                userName: 'angeloocana',
                email: '',
                displayName: '',
                password
            });
            user = yield userApp.hashPassword(user);
            stub(userRepository, 'getByUserNameOrEmail').returns(user);
            user = yield userApp.authenticateUser(user.userName, 'incorrectPassword');
            contains(user.errors, 'ERROR_USER_INVALID_USERNAME_OR_PASSWORD');
        }));
        it('User found and correct password should return the user', () => __awaiter(this, void 0, void 0, function* () {
            const password = 'testeteste';
            var user = new User({
                userName: 'angeloocana',
                email: 'alanmarcell@live.com',
                displayName: '',
                password
            });
            user = yield userApp.hashPassword(user);
            stub(userRepository, 'getByUserNameOrEmail').returns(user);
            user = yield userApp.authenticateUser(user.userName, password);
            ok(user);
            emptyArray(user.errors);
        }));
    });
    describe('getAuthToken', () => {
        var userApp, userRepository;
        beforeEach(() => {
            userRepository = new UserRepositoryFake(null);
            userApp = new UserApp(userRepository);
        });
        it('When user is valid password generate token', () => __awaiter(this, void 0, void 0, function* () {
            var user = new User({
                userName: 'lnsilva',
                email: 'lucas.neris@globalpoints.com.br', displayName: 'Lucas Neris',
                password: '123456'
            });
            user = yield userApp.hashPassword(user);
            stub(userRepository, 'getByUserNameOrEmail').returns(user);
            const userToken = yield userApp.getAuthToken('lnsilva', '123456');
            ok(userToken.accessToken, 'Empty Token');
        }));
        it('When user is invalid password does not generate token', () => __awaiter(this, void 0, void 0, function* () {
            const user = User.getUserAthenticationError('');
            stub(userRepository, 'getByUserNameOrEmail').returns(null);
            const userToken = yield userApp.getAuthToken('lnsilva', '123456');
            notOk(userToken.accessToken, 'Not Empty Token');
        }));
    });
    describe('verifyAuthToken', () => {
        var userApp, userRepository;
        beforeEach(() => {
            userRepository = new UserRepositoryFake(null);
            userApp = new UserApp(userRepository);
        });
        it('Invalid token throws exception', () => __awaiter(this, void 0, void 0, function* () {
            var hasError = false;
            try {
                yield userApp.verifyAuthToken('Invalid_Token');
            }
            catch (err) {
                hasError = true;
            }
            ok(hasError);
        }));
        it('Valid token return user', () => __awaiter(this, void 0, void 0, function* () {
            var user = new User({
                userName: 'lnsilva',
                email: 'lucas.neris@globalpoints.com.br',
                displayName: 'Lucas Neris',
                password: '123456'
            });
            user = yield userApp.hashPassword(user);
            stub(userRepository, 'getByUserNameOrEmail').returns(user);
            const userToken = yield userApp.getAuthToken('lnsilva', '123456');
            ok(userToken.accessToken, 'Empty Token');
            const userByToken = yield userApp.verifyAuthToken(userToken.accessToken);
            equal(userByToken.id, user.id, 'User Id dont match');
            equal(userByToken.email, user.email, 'User Id dont match');
            equal(userByToken.userName, user.userName, 'User Id dont match');
            equal(userByToken.displayName, user.displayName, 'User Id dont match');
        }));
    });
});
//# sourceMappingURL=userApp.test.js.map