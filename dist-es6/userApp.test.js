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
import { contains, emptyArray, equal, notEmptyArray, notOk, ok } from 'ptz-assert';
import { allErrors, User } from 'ptz-user-domain';
import { spy, stub } from 'sinon';
import { UserApp } from './index';
import UserRepositoryFake from './UserRepositoryFake';
const authedUser = {
    dtCreated: new Date(),
    ip: '192.161.0.1'
};
const notCalled = 'notCalled';
describe('UserApp', () => {
    describe('save', () => {
        var userApp, userRepository;
        beforeEach(() => {
            userRepository = new UserRepositoryFake(null);
            spy(userRepository, 'save');
            stub(userRepository, 'getOtherUsersWithSameUserNameOrEmail').returns([]);
            userApp = new UserApp({ userRepository });
        });
        it('hash password', () => __awaiter(this, void 0, void 0, function* () {
            const userArgs = {
                userName: 'angeloocana',
                email: 'angeloocana@gmail.com',
                displayName: 'Ângelo Ocanã',
                password: 'testPassword'
            };
            const user = yield userApp.saveUser({ userArgs, authedUser });
            ok(user.passwordHash, 'passwordHash not set');
            notOk(user.password, 'password not empty');
        }));
        it('do not call repository if user is invalid', () => __awaiter(this, void 0, void 0, function* () {
            const userArgs = {
                userName: '',
                email: '',
                displayName: ''
            };
            yield userApp.saveUser({ userArgs, authedUser });
            ok(userRepository.save[notCalled]);
        }));
        it('call repository if User is valid', () => __awaiter(this, void 0, void 0, function* () {
            const userArgs = {
                userName: 'angeloocana',
                email: 'angeloocana@gmail.com',
                displayName: 'Angelo Ocana'
            };
            yield userApp.saveUser({ userArgs, authedUser });
            const calledOnce = 'calledOnce';
            ok(userRepository.save[calledOnce]);
        }));
        it('set createdBy', () => __awaiter(this, void 0, void 0, function* () {
            const userArgs = {
                userName: 'angeloocana',
                email: 'angeloocana@gmail.com',
                displayName: ''
            };
            const user = yield userApp.saveUser({ userArgs, authedUser });
            equal(user.createdBy, authedUser);
        }));
    });
    describe('authUser', () => {
        var userApp, userRepository;
        beforeEach(() => {
            userRepository = new UserRepositoryFake(null);
            userApp = new UserApp({ userRepository });
        });
        it('return null when User not found', () => __awaiter(this, void 0, void 0, function* () {
            const userNameOrEmail = 'angeloocana', password = 'teste';
            stub(userRepository, 'getByUserNameOrEmail').returns(null);
            const user = yield userApp.authUser({
                form: { userNameOrEmail, password },
                authedUser
            });
            notOk(user);
        }));
        it('return null when User found but incorrect password', () => __awaiter(this, void 0, void 0, function* () {
            const password = 'testeteste';
            var user = new User({
                userName: 'angeloocana',
                email: '',
                displayName: '',
                password
            });
            user = yield userApp.hashPassword(user);
            stub(userRepository, 'getByUserNameOrEmail').returns(user);
            user = yield userApp.authUser({
                form: {
                    userNameOrEmail: user.userName,
                    password: 'incorrectPassword'
                },
                authedUser
            });
            notOk(user);
        }));
        it('return user when correct password', () => __awaiter(this, void 0, void 0, function* () {
            const password = 'testeteste';
            var user = new User({
                userName: 'angeloocana',
                email: 'alanmarcell@live.com',
                displayName: 'Angelo Ocana',
                password
            });
            user = yield userApp.hashPassword(user);
            stub(userRepository, 'getByUserNameOrEmail').returns(user);
            user = yield userApp.authUser({
                form: {
                    userNameOrEmail: user.userName,
                    password
                },
                authedUser
            });
            ok(user);
            emptyArray(user.errors);
        }));
    });
    describe('getAuthToken', () => {
        it('add errors when invalid userName or Email', () => __awaiter(this, void 0, void 0, function* () {
            const userRepository = new UserRepositoryFake(null);
            const userApp = new UserApp({ userRepository });
            spy(userRepository, 'getByUserNameOrEmail');
            const authToken = yield userApp.getAuthToken({
                form: {
                    userNameOrEmail: 'ln',
                    password: 'testtest'
                },
                authedUser
            });
            ok(userRepository.getByUserNameOrEmail[notCalled], 'Do NOT call repository getByUserNameOrEmail()');
            notOk(authToken.authToken, 'Do NOT Generate token');
            notOk(authToken.user, 'DO NOT return user');
            notEmptyArray(authToken.errors, 'return errors');
        }));
        it('add error when invalid password', () => __awaiter(this, void 0, void 0, function* () {
            const userRepository = new UserRepositoryFake(null);
            const userApp = new UserApp({ userRepository });
            spy(userRepository, 'getByUserNameOrEmail');
            const authToken = yield userApp.getAuthToken({
                form: {
                    userNameOrEmail: 'angeloocana',
                    password: 't'
                },
                authedUser
            });
            ok(userRepository.getByUserNameOrEmail[notCalled], 'Do NOT call repository getByUserNameOrEmail()');
            notOk(authToken.authToken, 'Do NOT Generate token');
            notOk(authToken.user, 'DO NOT return user');
            notEmptyArray(authToken.errors, 'return errors');
        }));
        it('generate token when correct password', () => __awaiter(this, void 0, void 0, function* () {
            const userRepository = new UserRepositoryFake(null);
            const userApp = new UserApp({ userRepository });
            var user = new User({
                userName: 'lnsilva',
                email: 'lucas.neris@globalpoints.com.br', displayName: 'Lucas Neris',
                password: '123456'
            });
            user = yield userApp.hashPassword(user);
            stub(userRepository, 'getByUserNameOrEmail').returns(user);
            const authToken = yield userApp.getAuthToken({
                form: {
                    userNameOrEmail: 'lnsilva',
                    password: '123456'
                },
                authedUser
            });
            ok(authToken.authToken, 'Empty Token');
            ok(authToken.user, 'no user');
            ok(authToken.user.id, 'no user id');
            emptyArray(authToken.errors, 'return errors');
        }));
        it('add errors when incorrect password', () => __awaiter(this, void 0, void 0, function* () {
            const userRepository = new UserRepositoryFake(null);
            const userApp = new UserApp({ userRepository });
            stub(userRepository, 'getByUserNameOrEmail').returns(null);
            const authToken = yield userApp.getAuthToken({
                form: {
                    userNameOrEmail: 'lnsilva',
                    password: '123456'
                },
                authedUser
            });
            notOk(authToken.authToken, 'do not generate token');
            notOk(authToken.user, 'do not return user');
            contains(authToken.errors, allErrors.ERROR_USERAPP_GETAUTHTOKEN_INVALID_USERNAME_OR_PASSWORD, 'return invalid userName, email or password error');
        }));
    });
    describe('verifyAuthToken', () => {
        var userApp, userRepository;
        beforeEach(() => {
            userRepository = new UserRepositoryFake(null);
            userApp = new UserApp({ userRepository });
        });
        it('Invalid token throws exception', () => __awaiter(this, void 0, void 0, function* () {
            var hasError = false;
            try {
                yield userApp.verifyAuthToken({
                    token: 'Invalid_Token',
                    authedUser
                });
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
            const authToken = yield userApp.getAuthToken({
                form: {
                    userNameOrEmail: 'lnsilva',
                    password: '123456'
                },
                authedUser
            });
            ok(authToken.authToken, 'Empty Token');
            const userByToken = yield userApp.verifyAuthToken({
                token: authToken.authToken,
                authedUser
            });
            equal(userByToken.id, user.id, 'User Id dont match');
            equal(userByToken.email, user.email, 'User Id dont match');
            equal(userByToken.userName, user.userName, 'User Id dont match');
            equal(userByToken.displayName, user.displayName, 'User Id dont match');
        }));
    });
});
//# sourceMappingURL=userApp.test.js.map