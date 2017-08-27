'use strict';

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _ptzAssert = require('ptz-assert');

var _ptzUserDomain = require('ptz-user-domain');

var _ptzValidations = require('ptz-validations');

var _sinon = require('sinon');

var _index = require('./index');

var _UserRepositoryFake = require('./UserRepositoryFake');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();
const authedUser = {
    dtCreated: new Date(),
    ip: '192.161.0.1'
};
const calledOnce = 'calledOnce',
      notCalled = 'notCalled';
var userRepository;
var userApp;
const passwordSalt = process.env.PASSWORD_SALT;
var saveUser;
beforeEach(() => {
    userRepository = (0, _UserRepositoryFake.createUserRepoFake)();
    (0, _sinon.spy)(userRepository, 'save');
    (0, _sinon.stub)(userRepository, 'getOtherUsersWithSameUserNameOrEmail').returns([]);
    saveUser = (0, _index.saveUser)({
        userRepository,
        hashPass: (0, _index.hashPassword)((0, _index.pHash)(passwordSalt)),
        isValid: _ptzValidations.isValid,
        updateUser: _ptzUserDomain.updateUser, otherUsersWithSameUserNameOrEmail: _ptzUserDomain.otherUsersWithSameUserNameOrEmail
    });
    userApp = (0, _index.createApp)({ userRepository });
});
describe('UserApp', () => {
    describe('saveUser', () => {
        describe('insert', () => {
            it('hash password', async () => {
                const userArgs = {
                    userName: 'angeloocana',
                    email: 'angeloocana@gmail.com',
                    displayName: 'Ângelo Ocanã',
                    password: 'testPassword'
                };
                const user = await saveUser({ userArgs, authedUser });
                (0, _ptzAssert.ok)(user.passwordHash, 'passwordHash not set');
                (0, _ptzAssert.notOk)(user.password, 'password not empty');
            });
            it('do not call repository if user is invalid', async () => {
                const userArgs = {
                    userName: '',
                    email: '',
                    displayName: ''
                };
                await saveUser({ userArgs, authedUser });
                (0, _ptzAssert.ok)(userRepository.save[notCalled]);
            });
            it('call repository if User is valid', async () => {
                const userArgs = {
                    userName: 'angeloocana',
                    email: 'angeloocana@gmail.com',
                    displayName: 'Angelo Ocana'
                };
                await saveUser({ userArgs, authedUser });
                (0, _ptzAssert.ok)(userRepository.save[calledOnce]);
            });
            it('set createdBy', async () => {
                const userArgs = {
                    userName: 'angeloocana',
                    email: 'angeloocana@gmail.com',
                    displayName: ''
                };
                const user = await saveUser({ userArgs, authedUser });
                (0, _ptzAssert.equal)(user.createdBy, authedUser);
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
                (0, _sinon.stub)(userRepository, 'getById').returns(dbUser);
                const userArgs = {
                    userName: 'angeloocana',
                    email: 'angeloocana@gmail.com',
                    displayName: 'Angelo Ocana Updated'
                };
                const userSaved = await saveUser({ userArgs, authedUser });
                (0, _ptzAssert.ok)(userRepository.save[calledOnce]);
                (0, _ptzAssert.equal)(userSaved.displayName, userArgs.displayName);
            });
        });
    });
    describe('authUser', () => {
        it('return null when User not found', async () => {
            const userNameOrEmail = 'angeloocana',
                  password = 'teste';
            (0, _sinon.stub)(userRepository, 'getByUserNameOrEmail').returns(null);
            const user = await userApp.authUser({
                form: { userNameOrEmail, password },
                authedUser
            });
            (0, _ptzAssert.notOk)(user);
        });
        it('return null when User found but incorrect password', async () => {
            const password = 'testeteste';
            var user = (0, _ptzUserDomain.createUser)({
                userName: 'angeloocana',
                email: '',
                displayName: '',
                password
            });
            user = await userApp.hashPassword(user);
            (0, _sinon.stub)(userRepository, 'getByUserNameOrEmail').returns(user);
            user = await userApp.authUser({
                form: {
                    userNameOrEmail: user.userName,
                    password: 'incorrectPassword'
                },
                authedUser
            });
            (0, _ptzAssert.notOk)(user);
        });
        it('return user when correct password', async () => {
            const password = 'testeteste';
            var user = (0, _ptzUserDomain.createUser)({
                userName: 'angeloocana',
                email: 'alanmarcell@live.com',
                displayName: 'Angelo Ocana',
                password
            });
            (0, _sinon.stub)(userRepository, 'getByUserNameOrEmail').returns(user);
            userApp = (0, _index.createApp)({ userRepository });
            user = await userApp.hashPassword(user);
            user = await userApp.authUser({
                form: {
                    userNameOrEmail: user.userName,
                    password
                },
                authedUser
            });
            (0, _ptzAssert.ok)(user);
            (0, _ptzAssert.emptyArray)(user.errors);
        });
    });
    describe('getAuthToken', () => {
        it('add errors when invalid userName or Email', async () => {
            (0, _sinon.spy)(userRepository, 'getByUserNameOrEmail');
            const authToken = await userApp.getAuthToken({
                form: {
                    userNameOrEmail: 'ln',
                    password: 'testtest'
                },
                authedUser
            });
            (0, _ptzAssert.ok)(userRepository.getByUserNameOrEmail[notCalled], 'Do NOT call repository getByUserNameOrEmail()');
            (0, _ptzAssert.notOk)(authToken.authToken, 'Do NOT Generate token');
            (0, _ptzAssert.notOk)(authToken.user, 'DO NOT return user');
            (0, _ptzAssert.notEmptyArray)(authToken.errors, 'return errors');
        });
        it('add error when invalid password', async () => {
            (0, _sinon.spy)(userRepository, 'getByUserNameOrEmail');
            const authToken = await userApp.getAuthToken({
                form: {
                    userNameOrEmail: 'angeloocana',
                    password: 't'
                },
                authedUser
            });
            (0, _ptzAssert.ok)(userRepository.getByUserNameOrEmail[notCalled], 'Do NOT call repository getByUserNameOrEmail()');
            (0, _ptzAssert.notOk)(authToken.authToken, 'Do NOT Generate token');
            (0, _ptzAssert.notOk)(authToken.user, 'DO NOT return user');
            (0, _ptzAssert.notEmptyArray)(authToken.errors, 'return errors');
        });
        it('generate token when correct password', async () => {
            var user = (0, _ptzUserDomain.createUser)({
                userName: 'lnsilva',
                email: 'lucas.neris@globalpoints.com.br', displayName: 'Lucas Neris',
                password: '123456'
            });
            (0, _sinon.stub)(userRepository, 'getByUserNameOrEmail').returns(user);
            userApp = (0, _index.createApp)({ userRepository });
            user = await userApp.hashPassword(user);
            const authToken = await userApp.getAuthToken({
                form: {
                    userNameOrEmail: 'lnsilva',
                    password: '123456'
                },
                authedUser
            });
            (0, _ptzAssert.ok)(authToken.authToken, 'Empty Token');
            (0, _ptzAssert.ok)(authToken.user, 'no user');
            (0, _ptzAssert.ok)(authToken.user.id, 'no user id');
            (0, _ptzAssert.emptyArray)(authToken.errors, 'return errors');
        });
        it('add errors when incorrect password', async () => {
            (0, _sinon.stub)(userRepository, 'getByUserNameOrEmail').returns(null);
            const authToken = await userApp.getAuthToken({
                form: {
                    userNameOrEmail: 'lnsilva',
                    password: '123456'
                },
                authedUser
            });
            (0, _ptzAssert.notOk)(authToken.authToken, 'do not generate token');
            (0, _ptzAssert.notOk)(authToken.user, 'do not return user');
            (0, _ptzAssert.contains)(authToken.errors, _ptzUserDomain.allErrors.ERROR_USERAPP_GETAUTHTOKEN_INVALID_USERNAME_OR_PASSWORD, 'return invalid userName, email or password error');
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
            (0, _ptzAssert.ok)(hasError);
        });
        it('Valid token return user', async () => {
            var user = (0, _ptzUserDomain.createUser)({
                userName: 'lnsilva',
                email: 'lucas.neris@globalpoints.com.br',
                displayName: 'Lucas Neris',
                password: '123456'
            });
            (0, _sinon.stub)(userRepository, 'getByUserNameOrEmail').returns(user);
            userApp = (0, _index.createApp)({ userRepository });
            user = await userApp.hashPassword(user);
            const authToken = await userApp.getAuthToken({
                form: {
                    userNameOrEmail: 'lnsilva',
                    password: '123456'
                },
                authedUser
            });
            (0, _ptzAssert.ok)(authToken.authToken, 'Empty Token');
            const userByToken = await userApp.verifyAuthToken({
                token: authToken.authToken,
                authedUser
            });
            (0, _ptzAssert.equal)(userByToken.id, user.id, 'User Id dont match');
            (0, _ptzAssert.equal)(userByToken.email, user.email, 'User Id dont match');
            (0, _ptzAssert.equal)(userByToken.userName, user.userName, 'User Id dont match');
            (0, _ptzAssert.equal)(userByToken.displayName, user.displayName, 'User Id dont match');
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
        it('call repository', async () => {
            const dbUsers = [{ name: 'teste' }];
            (0, _sinon.stub)(userRepository, 'find').returns(dbUsers);
            userApp = (0, _index.createApp)({ userRepository });
            const query = {};
            const options = { limit: 4 };
            const users = await userApp.findUsers({ authedUser, options, query });
            (0, _ptzAssert.ok)(userRepository.find[calledOnce]);
            (0, _ptzAssert.equal)(users, dbUsers, 'users not returned');
        });
    });
    describe('seed', () => {
        it('default users', async () => {
            const dbUsers = [{ name: 'teste' }];
            (0, _sinon.stub)(userRepository, 'find').returns(dbUsers);
            const seeded = await userApp.seed(userRepository);
            (0, _ptzAssert.ok)(seeded);
        });
        it('custom users');
    });
});
//# sourceMappingURL=userApp.test.js.map
//# sourceMappingURL=userApp.test.js.map