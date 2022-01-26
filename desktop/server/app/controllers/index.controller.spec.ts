import * as chai from 'chai';
import 'chai-http';
import { testingContainer } from '../../test/test-utils';
import { DatabaseService } from '../services/database.service';
import { DatabaseController } from './database.controller';
import { IndexController } from './index.controller';
chai.use(require('chai-http'));

// tslint:disable
describe('IndexController', () => {
    let indexController: IndexController;

    beforeEach(async () => {
        indexController = new IndexController(new DatabaseController(new DatabaseService()));
        const [] = await testingContainer();
    });

    it('should instanciate correctly', (done: Mocha.Done) => {
        chai.expect(indexController).to.be.instanceOf(IndexController);
        done();
    });
});
