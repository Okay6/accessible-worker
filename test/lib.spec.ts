import {expect} from 'chai';
import {MyOwnModule} from "../project/worker_module";
describe('template spec', () => {
    it('passes', () => {
        expect(typeof MyOwnModule.uuid()).eq('string')
    })
})