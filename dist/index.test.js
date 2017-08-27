'use strict';

var _ptzAssert = require('ptz-assert');

var _index = require('./index');

var Core = _interopRequireWildcard(_index);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

describe('ptz-user-app', () => {
    describe('exports', () => {
        // TODO: Actions after ptz-validations
        // it('Action', () => ok(ActionExecution));
        it('authUser', () => (0, _ptzAssert.ok)(Core.authUser));
        it('createApp', () => (0, _ptzAssert.ok)(Core.createApp));
        it('createUserRepoFake', () => (0, _ptzAssert.ok)(Core.createUserRepoFake));
        it('deleteUser', () => (0, _ptzAssert.ok)(Core.deleteUser));
    });
});
//# sourceMappingURL=index.test.js.map
//# sourceMappingURL=index.test.js.map