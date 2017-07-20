import { ok } from 'ptz-assert';
import * as Core from './index';

describe('ptz-user-app', () => {
    describe('exports', () => {
        // TODO: Actions after ptz-validations
        // it('Action', () => ok(ActionExecution));
        it('authUser', () => ok(Core.authUser));
        it('createApp', () => ok(Core.createApp));
        it('createUserRepoFake', () => ok(Core.createUserRepoFake));
        it('deleteUser', () => ok(Core.deleteUser));
    });
});
