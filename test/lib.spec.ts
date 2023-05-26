import {expect} from 'chai';
import {MyOwnModule} from "../src/worker_module";
describe('template spec', () => {
    it('passes', () => {
        expect(typeof MyOwnModule.uuid()).eq('string')
    })
})