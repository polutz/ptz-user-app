'use strict';

var _ptzAssert = require('ptz-assert');

var _index = require('./index');

var Core = _interopRequireWildcard(_index);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

describe('ptz-user-app', function () {
    describe('exports', function () {
        // TODO: Actions after ptz-validations
        // it('Action', () => ok(ActionExecution));
        it('authUser', function () {
            return (0, _ptzAssert.ok)(Core.authUser);
        });
        it('createApp', function () {
            return (0, _ptzAssert.ok)(Core.createApp);
        });
        it('createUserRepoFake', function () {
            return (0, _ptzAssert.ok)(Core.createUserRepoFake);
        });
        it('deleteUser', function () {
            return (0, _ptzAssert.ok)(Core.deleteUser);
        });
    });
});
//# sourceMappingURL=index.test.js.map
//# sourceMappingURL=index.test.js.map