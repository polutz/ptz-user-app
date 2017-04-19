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
import { errors as allErrors, ICreatedBy, IUser, IUserApp, IUserArgs, IUserRepository, User } from 'ptz-user-domain';
import { spy, stub } from 'sinon';
import UserApp from './userApp';
import UserRepositoryFake from './UserRepositoryFake';

const createdBy: ICreatedBy = {
    dtCreated: new Date(),
    ip: ''
};

describe('UserApp', () => {
    describe('save', () => {
        var userApp: IUserApp,
            userRepository: IUserRepository;

        beforeEach(() => {
            userRepository = new UserRepositoryFake(null);

            spy(userRepository, 'save');
            stub(userRepository, 'getOtherUsersWithSameUserNameOrEmail').returns([]);

            userApp = new UserApp({ userRepository });
        });

        it('hash password', async () => {
            const userArgs: IUserArgs = {
                userName: 'angeloocana',
                email: 'angeloocana@gmail.com',
                displayName: 'Ângelo Ocanã',
                password: 'testPassword'
            };

            const user = await userApp.save({ userArgs, createdBy });

            ok(user.passwordHash, 'passwordHash not set');
            notOk(user.password, 'password not empty');
        });

        it('do not call repository if user is invalid', async () => {
            const userArgs = {
                userName: '',
                email: '',
                displayName: ''
            };
            await userApp.save({ userArgs, createdBy });
            const notCalled = 'notCalled';
            ok(userRepository.save[notCalled]);
        });

        it('call repository if User is valid', async () => {
            const userArgs: IUserArgs = {
                userName: 'angeloocana',
                email: 'angeloocana@gmail.com',
                displayName: ''
            };
            await userApp.save({ userArgs, createdBy });
            const calledOnce = 'calledOnce';
            ok(userRepository.save[calledOnce]);
        });

        it('set createdBy', async () => {
            const userArgs: IUserArgs = {
                userName: 'angeloocana',
                email: 'angeloocana@gmail.com',
                displayName: ''
            };
            const user = await userApp.save({ userArgs, createdBy });
            equal(user.createdBy, createdBy);
        });
    });

    describe('authenticateUser', () => {
        var userApp: IUserApp,
            userRepository: IUserRepository;

        beforeEach(() => {
            userRepository = new UserRepositoryFake(null);
            userApp = new UserApp({ userRepository });
        });

        it('User not found should return null', async () => {
            const userNameOrEmail = 'angeloocana',
                password = 'teste';

            stub(userRepository, 'getByUserNameOrEmail').returns(null);

            const user = await userApp.authenticateUser({
                form: { userNameOrEmail, password },
                createdBy
            });

            notOk(user);
        });

        it('User found but incorrect password should return null', async () => {
            const password = 'testeteste';

            var user: IUser = new User({
                userName: 'angeloocana',
                email: '',
                displayName: '',
                password
            });

            user = await userApp.hashPassword(user);

            stub(userRepository, 'getByUserNameOrEmail').returns(user);

            user = await userApp.authenticateUser({
                form: {
                    userNameOrEmail: user.userName,
                    password: 'incorrectPassword'
                },
                createdBy
            });

            notOk(user);
        });

        it('User found and correct password should return the user', async () => {
            const password = 'testeteste';

            var user: IUser = new User({
                userName: 'angeloocana',
                email: 'alanmarcell@live.com',
                displayName: '',
                password
            });

            user = await userApp.hashPassword(user);

            stub(userRepository, 'getByUserNameOrEmail').returns(user);

            user = await userApp.authenticateUser({
                form: {
                    userNameOrEmail: user.userName,
                    password
                },
                createdBy
            });

            ok(user);
            emptyArray(user.errors);
        });
    });

    describe('getAuthToken', () => {
        var userApp: IUserApp,
            userRepository: IUserRepository;

        beforeEach(() => {
            userRepository = new UserRepositoryFake(null);
            userApp = new UserApp({ userRepository });
        });

        it('When user is valid password generate token', async () => {
            var user: IUser = new User({
                userName: 'lnsilva'
                , email: 'lucas.neris@globalpoints.com.br', displayName: 'Lucas Neris',
                password: '123456'
            });

            user = await userApp.hashPassword(user);
            stub(userRepository, 'getByUserNameOrEmail').returns(user);

            const authToken = await userApp.getAuthToken({
                form: {
                    userNameOrEmail: 'lnsilva',
                    password: '123456'
                },
                createdBy
            });

            ok(authToken.authToken, 'Empty Token');
        });

        describe('invalid password', async () => {
            stub(userRepository, 'getByUserNameOrEmail').returns(null);

            const authToken = await userApp.getAuthToken({
                form: {
                    userNameOrEmail: 'lnsilva',
                    password: '123456'
                },
                createdBy
            });

            it('do not generate token', () => {
                notOk(authToken.authToken);
            });

            it('do not return user', () => {
                notOk(authToken.user);
            });

            it('return invalid userName, email or password error', () => {
                contains(authToken.errors, allErrors.ERROR_USERAPP_GETAUTHTOKEN_INVALID_USERNAME_OR_PASSWORD);
            });
        });
    });

    describe('verifyAuthToken', () => {
        var userApp: IUserApp,
            userRepository: IUserRepository;

        beforeEach(() => {
            userRepository = new UserRepositoryFake(null);
            userApp = new UserApp({ userRepository });
        });

        it('Invalid token throws exception', async () => {
            var hasError = false;
            try {
                await userApp.verifyAuthToken({
                    token: 'Invalid_Token',
                    createdBy
                });
            } catch (err) {
                hasError = true;
            }
            ok(hasError);
        });

        it('Valid token return user', async () => {
            var user: IUser = new User({
                userName: 'lnsilva',
                email: 'lucas.neris@globalpoints.com.br',
                displayName: 'Lucas Neris',
                password: '123456'
            });

            user = await userApp.hashPassword(user);
            stub(userRepository, 'getByUserNameOrEmail').returns(user);

            const authToken = await userApp.getAuthToken({
                form: {
                    userNameOrEmail: 'lnsilva',
                    password: '123456'
                },
                createdBy
            });

            ok(authToken.authToken, 'Empty Token');

            const userByToken = await userApp.verifyAuthToken({
                token: authToken.authToken,
                createdBy
            });

            equal(userByToken.id, user.id, 'User Id dont match');

            equal(userByToken.email, user.email, 'User Id dont match');

            equal(userByToken.userName, user.userName, 'User Id dont match');

            equal(userByToken.displayName, user.displayName, 'User Id dont match');
        });
    });
});
