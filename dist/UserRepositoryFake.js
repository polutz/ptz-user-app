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
    return {
        collectionName: repo.collectionName,
        db: repo.db,
        save: repo.save,
        find: repo.find,
        getById: repo.getById,
        getByIds: repo.getByIds,
        getByUserNameOrEmail: getByUserNameOrEmail,
        getDbCollection: repo.getDbCollection,
        getOtherUsersWithSameUserNameOrEmail: getOtherUsersWithSameUserNameOrEmail
    };
};
var getOtherUsersWithSameUserNameOrEmail = exports.getOtherUsersWithSameUserNameOrEmail = function getOtherUsersWithSameUserNameOrEmail(user) {
    return Promise.resolve(entities);
};
var getByUserNameOrEmail = exports.getByUserNameOrEmail = function getByUserNameOrEmail(userNameOrEmail) {
    return Promise.resolve(entities[0]);
};
//# sourceMappingURL=UserRepositoryFake.js.map
//# sourceMappingURL=UserRepositoryFake.js.map