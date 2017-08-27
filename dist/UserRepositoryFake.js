'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getByUserNameOrEmail = exports.getOtherUsersWithSameUserNameOrEmail = exports.createUserRepoFake = exports.entities = undefined;

var _ptzCoreApp = require('ptz-core-app');

let entities = exports.entities = [];
const createUserRepoFake = exports.createUserRepoFake = () => {
    exports.entities = entities = [];
    const repo = (0, _ptzCoreApp.createRepository)('collectionFake', 'urlFake');
    return {
        collectionName: repo.collectionName,
        db: repo.db,
        save: repo.save,
        find: repo.find,
        getById: repo.getById,
        getByIds: repo.getByIds,
        getByUserNameOrEmail,
        getDbCollection: repo.getDbCollection,
        getOtherUsersWithSameUserNameOrEmail
    };
};
const getOtherUsersWithSameUserNameOrEmail = exports.getOtherUsersWithSameUserNameOrEmail = user => {
    return Promise.resolve(entities);
};
const getByUserNameOrEmail = exports.getByUserNameOrEmail = userNameOrEmail => {
    return Promise.resolve(entities[0]);
};
//# sourceMappingURL=UserRepositoryFake.js.map
//# sourceMappingURL=UserRepositoryFake.js.map