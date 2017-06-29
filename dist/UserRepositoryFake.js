'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getByUserNameOrEmail = exports.getOtherUsersWithSameUserNameOrEmail = exports.createUserRepoFake = exports.entities = undefined;

var _ptzCoreApp = require('@alanmarcell/ptz-core-app');

var entities = exports.entities = [];
var createUserRepoFake = exports.createUserRepoFake = function createUserRepoFake() {
    exports.entities = entities = [];
    var repo = (0, _ptzCoreApp.createRepository)('collectionFake', 'urlFake');
    // tslint:disable-next-line:no-string-literal
    repo['getByUserNameOrEmail'] = getByUserNameOrEmail;
    // tslint:disable-next-line:no-string-literal
    repo['getOtherUsersWithSameUserNameOrEmail'] = getOtherUsersWithSameUserNameOrEmail;
    return repo;
};
var getOtherUsersWithSameUserNameOrEmail = exports.getOtherUsersWithSameUserNameOrEmail = function getOtherUsersWithSameUserNameOrEmail(user) {
    return Promise.resolve(entities);
};
var getByUserNameOrEmail = exports.getByUserNameOrEmail = function getByUserNameOrEmail(userNameOrEmail) {
    return Promise.resolve(entities[0]);
};
//# sourceMappingURL=UserRepositoryFake.js.map
//# sourceMappingURL=UserRepositoryFake.js.map