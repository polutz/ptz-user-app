import dotenv from 'dotenv';
dotenv.config();

import {
    contains,
    emptyArray,
    equal,
    notEmptyArray,
    notOk,
    ok
} from 'ptz-assert';

import {
    allErrors, createUser, ICreatedBy, IUserApp, IUserArgs
} from '@alanmarcell/ptz-user-domain';
import { spy, stub } from 'sinon';
import { createApp } from './index';
import { createUserRepoFake } from './UserRepositoryFake';

const authedUser: ICreatedBy = {
    dtCreated: new Date(),
    ip: '192.161.0.1'
};

const calledOnce = 'calledOnce',
    notCalled = 'notCalled';
var userRepository;
var userApp: IUserApp;

beforeEach(() => {
    userRepository = createUserRepoFake();
    spy(userRepository, 'save');
    stub(userRepository, 'getOtherUsersWithSameUserNameOrEmail').returns([]);

    userApp = createApp({ userRepository });
});
describe('UserApp', () => {
    describe('saveUser', () => {
        describe('insert', () => {

            it('hash password', async () => {
                const userArgs: IUserArgs = {
                    userName: 'angeloocana',
                    email: 'angeloocana@gmail.com',
                    displayName: 'Ângelo Ocanã',
                    password: 'testPassword'
                };

                const user = await userApp.saveUser({ userArgs, authedUser });

                ok(user.passwordHash, 'passwordHash not set');
                notOk(user.password, 'password not empty');
            });

            it('do not call repository if user is invalid', async () => {
                const userArgs = {
                    userName: '',
                    email: '',
                    displayName: ''
                };
                await userApp.saveUser({ userArgs, authedUser });
                ok(userRepository.save[notCalled]);
            });

            it('call repository if User is valid', async () => {
                const userArgs: IUserArgs = {
                    userName: 'angeloocana',
                    email: 'angeloocana@gmail.com',
                    displayName: 'Angelo Ocana'
                };
                await userApp.saveUser({ userArgs, authedUser });
                ok(userRepository.save[calledOnce]);
            });

            it('set createdBy', async () => {
                const userArgs: IUserArgs = {
                    userName: 'angeloocana',
                    email: 'angeloocana@gmail.com',
                    displayName: ''
                };
                const user = await userApp.saveUser({ userArgs, authedUser });
                equal(user.createdBy, authedUser);
            });
        });

        describe('update', () => {
            it('update when new user data is valid', async () => {

                // spy(userRepository, 'save');
                // stub(userRepository, 'getOtherUsersWithSameUserNameOrEmail').returns([]);

                const dbUser = {
                    userName: 'angeloocana',
                    email: 'angeloocana@gmail.com',
                    displayName: 'Angelo Ocana'
                };

                stub(userRepository, 'getById').returns(dbUser);

                const userArgs: IUserArgs = {
                    userName: 'angeloocana',
                    email: 'angeloocana@gmail.com',
                    displayName: 'Angelo Ocana Updated'
                };

                const userSaved = await userApp.saveUser({ userArgs, authedUser });
                ok(userRepository.save[calledOnce]);
                equal(userSaved.displayName, userArgs.displayName);
            });
        });
    });

    describe('authUser', () => {

        it('return null when User not found', async () => {
            const userNameOrEmail = 'angeloocana',
                password = 'teste';

            stub(userRepository, 'getByUserNameOrEmail').returns(null);

            const user = await userApp.authUser({
                form: { userNameOrEmail, password },
                authedUser
            });

            notOk(user);
        });

        it('return null when User found but incorrect password', async () => {
            const password = 'testeteste';

            var user = createUser({
                userName: 'angeloocana',
                email: '',
                displayName: '',
                password
            });

            user = await userApp.hashPassword(user);

            stub(userRepository, 'getByUserNameOrEmail').returns(user);

            user = await userApp.authUser({
                form: {
                    userNameOrEmail: user.userName,
                    password: 'incorrectPassword'
                },
                authedUser
            });

            notOk(user);
        });

        it('return user when correct password', async () => {
            const password = 'testeteste';

            var user = createUser({
                userName: 'angeloocana',
                email: 'alanmarcell@live.com',
                displayName: 'Angelo Ocana',
                password
            });

            user = await userApp.hashPassword(user);

            stub(userRepository, 'getByUserNameOrEmail').returns(user);

            user = await userApp.authUser({
                form: {
                    userNameOrEmail: user.userName,
                    password
                },
                authedUser
            });

            ok(user);
            emptyArray(user.errors);
        });
    });

    describe('getAuthToken', () => {
        it('add errors when invalid userName or Email', async () => {

            spy(userRepository, 'getByUserNameOrEmail');
            const authToken = await userApp.getAuthToken({
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
        });

        it('add error when invalid password', async () => {

            spy(userRepository, 'getByUserNameOrEmail');

            const authToken = await userApp.getAuthToken({
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
        });

        it('generate token when correct password', async () => {

            var user = createUser({
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
                authedUser
            });

            ok(authToken.authToken, 'Empty Token');
            ok(authToken.user, 'no user');
            ok(authToken.user.id, 'no user id');
            emptyArray(authToken.errors, 'return errors');
        });

        it('add errors when incorrect password', async () => {

            stub(userRepository, 'getByUserNameOrEmail').returns(null);

            const authToken = await userApp.getAuthToken({
                form: {
                    userNameOrEmail: 'lnsilva',
                    password: '123456'
                },
                authedUser
            });

            notOk(authToken.authToken, 'do not generate token');
            notOk(authToken.user, 'do not return user');
            contains(authToken.errors,
                allErrors.ERROR_USERAPP_GETAUTHTOKEN_INVALID_USERNAME_OR_PASSWORD,
                'return invalid userName, email or password error');
        });
    });

    describe('verifyAuthToken', () => {

        it('Invalid token throws exception', async () => {
            var hasError = false;
            try {
                await userApp.verifyAuthToken({
                    token: 'Invalid_Token',
                    authedUser
                });
            } catch (err) {
                hasError = true;
            }
            ok(hasError);
        });

        it('Valid token return user', async () => {
            var user = createUser({
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
                authedUser
            });

            ok(authToken.authToken, 'Empty Token');

            const userByToken = await userApp.verifyAuthToken({
                token: authToken.authToken,
                authedUser
            });

            equal(userByToken.id, user.id, 'User Id dont match');

            equal(userByToken.email, user.email, 'User Id dont match');

            equal(userByToken.userName, user.userName, 'User Id dont match');

            equal(userByToken.displayName, user.displayName, 'User Id dont match');
        });
    });

    describe('updatePassword', () => {
        it('return error when wrong password');
        it('return error when invalid password');
        it('update');
    });

    describe('updatePasswordToken', () => {
        it('return error when wrong token');
        it('return error when invalid password');
        it('update');
    });

    describe('deleteUser', () => {
        it('return error when user not found');
        it('return error when authuser is not admin or the deleted user');
        it('delete');
    });

    describe('findUsers', () => {
        it('call repository', () => {

            const dbUsers = [];
            stub(userRepository, 'find').returns(dbUsers);

            const query = {};

            const options = { limit: 4 };

            const users = userApp.findUsers({ authedUser, options, query });

            ok(userRepository.find[calledOnce]);
            equal(users, dbUsers, 'users not returned');
        });
    });

    describe('seed', () => {
        it('default users');
        it('custom users');
    });
});
