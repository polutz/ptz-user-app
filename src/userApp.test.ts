import dotenv from 'dotenv';
dotenv.config();

import {
    contains,
    emptyArray,
    equal,
    notContains,
    notOk,
    ok,
    throws
} from 'ptz-assert';
import { IUserApp, IUserRepository, User } from 'ptz-user-domain';
import { stub } from 'sinon';
import UserApp from './userApp';

var userApp: IUserApp;

describe('UserApp', () => {
    describe('save', () => {
        beforeEach(() => {
            userRepositorySaveCalls = 0;
            userRepository = getUserRepository();

            userRepository.save = async function (user) {
                userRepositorySaveCalls++;
                return Promise.resolve(user);
            };

            stub(userRepository, 'getOtherUsersWithSameUserNameOrEmail').returns([]);
            userApp = new UserApp(userRepository);
        });

        it('hash password', async () => {
            var user: IUserArgs = {
                userName: 'angeloocana',
                email: 'angeloocana@gmail.com',
                displayName: 'Ângelo Ocanã',
                password: 'testPassword'
            };

            user = await userApp.save(user);

            ok(user.passwordHash, 'passwordHash not set');
            notOk(user.password, 'password not empty');
        });

        it('do not call repository if user is invalid', async () => {
            const user = {
                userName: '',
                email: '',
                displayName: ''
            };
            await userApp.save(user);
            equal(userRepositorySaveCalls, 0);
        });

        it('call repository if User is valid', async () => {
            const user: IUserArgs = {
                userName: 'angeloocana',
                email: 'angeloocana@gmail.com',
                displayName: ''
            };
            await userApp.save(user);
            equal(userRepositorySaveCalls, 1);
        });
    });

    describe('authenticateUser', () => {
        beforeEach(() => {
            userRepository = new UserRepository(null);
            userApp = new UserApp(userRepository);
        });

        it('User not found should return user with error', async () => {
            const userName = 'angeloocana';
            stub(userRepository, 'getByUserNameOrEmail').returns(null);

            const user = await userApp.authenticateUser(userName, 'teste');

            contains(user.errors, 'ERROR_USER_INVALID_USERNAME_OR_PASSWORD');
        });

        it('User found but incorrect password should return user with error', async () => {
            const password = 'testeteste';

            var user = new User({ userName: 'angeloocana', email: '', displayName: '', password });

            user = await userApp.hashPassword(user);

            stub(userRepository, 'getByUserNameOrEmail').returns(user);

            user = await userApp.authenticateUser(user.userName, 'incorrectPassword');

            contains(user.errors, 'ERROR_USER_INVALID_USERNAME_OR_PASSWORD');

        });
        it('User found and correct password should return the user', async () => {
            const password = 'testeteste';

            var user = new User({ userName: 'angeloocana', email: 'alanmarcell@live.com', displayName: '', password });

            user = await userApp.hashPassword(user);

            stub(userRepository, 'getByUserNameOrEmail').returns(user);

            user = await userApp.authenticateUser(user.userName, password);

            ok(user);
            emptyArray(user.errors);
        });
    });

    describe('getAuthToken', () => {
        beforeEach(() => {
            userRepository = UserRepository(null);
            userApp = UserApp(userRepository);
        });

        it('When user is valid password generate token', async () => {
            var user = new User({
                userName: 'lnsilva'
                , email: 'lucas.neris@globalpoints.com.br', displayName: 'Lucas Neris',
                password: '123456'
            });

            user = await userApp.hashPassword(user);
            stub(userRepository, 'getByUserNameOrEmail').returns(user);

            const userToken = await userApp.getAuthToken('lnsilva', '123456');

            ok(userToken.accessToken, 'Empty Token');
        });

        it('When user is invalid password does not generate token', async () => {

            const user = User.getUserAthenticationError('');

            stub(userRepository, 'getByUserNameOrEmail').returns(null);

            const userToken = await userApp.getAuthToken('lnsilva', '123456');

            notOk(userToken.accessToken, 'Not Empty Token');
        });
    });

    describe('verifyAuthToken', () => {
        beforeEach(() => {
            userRepository = new UserRepository(null);
            userApp = new UserApp(userRepository);
        });

        it('Invalid token throws exception', async () => {
            var hasError = false;
            try {
                await userApp.verifyAuthToken('Invalid_Token');
            } catch (err) {
                hasError = true;
            }
            ok(hasError);
        });

        it('Valid token return user', async () => {
            var user = new User({
                userName: 'lnsilva',
                email: 'lucas.neris@globalpoints.com.br',
                displayName: 'Lucas Neris',
                password: '123456'
            });

            user = await userApp.hashPassword(user);
            stub(userRepository, 'getByUserNameOrEmail').returns(user);

            const userToken = await userApp.getAuthToken('lnsilva', '123456');

            ok(userToken.accessToken, 'Empty Token');

            const userByToken = await userApp.verifyAuthToken(userToken.accessToken);

            equal(userByToken.id, user.id, 'User Id dont match');

            equal(userByToken.email, user.email, 'User Id dont match');

            equal(userByToken.userName, user.userName, 'User Id dont match');

            equal(userByToken.displayName, user.displayName, 'User Id dont match');
        });
    });
});
