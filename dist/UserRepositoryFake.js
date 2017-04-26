'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ptzCoreApp = require('ptz-core-app');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var UserRepositoryFake = function (_BaseRepositoryFake) {
    _inherits(UserRepositoryFake, _BaseRepositoryFake);

    function UserRepositoryFake(db) {
        _classCallCheck(this, UserRepositoryFake);

        return _possibleConstructorReturn(this, (UserRepositoryFake.__proto__ || Object.getPrototypeOf(UserRepositoryFake)).call(this, db, 'users'));
    }

    _createClass(UserRepositoryFake, [{
        key: 'getOtherUsersWithSameUserNameOrEmail',
        value: function getOtherUsersWithSameUserNameOrEmail(user) {
            return Promise.resolve(this.entities);
        }
    }, {
        key: 'getByUserNameOrEmail',
        value: function getByUserNameOrEmail(userNameOrEmail) {
            return Promise.resolve(this.entities[0]);
        }
    }]);

    return UserRepositoryFake;
}(_ptzCoreApp.BaseRepositoryFake);
//# sourceMappingURL=UserRepositoryFake.js.map


exports.default = UserRepositoryFake;
//# sourceMappingURL=UserRepositoryFake.js.map