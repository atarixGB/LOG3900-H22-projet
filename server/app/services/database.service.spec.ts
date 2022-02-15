import { DrawingMetadata } from '@app/classes/drawing-metadata';
import { Drawing } from '@common/communication/drawing';
import { ObjectId } from 'bson';
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { DrawingData } from '../classes/drawing-data';
import { DatabaseService } from './database.service';

chai.use(chaiAsPromised);

// tslint:disable
describe('Database service', () => {
    let databaseService: DatabaseService;
    let mongoServer: MongoMemoryServer;
    let validDrawing: DrawingData;
    let invalidDrawing: DrawingData;

    beforeEach(async () => {
        databaseService = new DatabaseService();
        mongoServer = new MongoMemoryServer();

        validDrawing = {
            _id: '123456789101112131415161',
            title: 'title',
            labels: ['tag1', 'tag2'],
            height: 0,
            width: 0,
            body: 'data:image/png;base64,imagedatahere12345',
        };
        invalidDrawing = {
            _id: '123456789101112131415161',
            title: '!nv@l!d',
            labels: ['ta#$%'],
            height: 0,
            width: 0,
            body: 'data:image/png;base64,imagedatahere12345',
        };

        const mongoUri = await mongoServer.getUri();
        await databaseService.start(mongoUri);
    });

    afterEach(async () => {
        if (databaseService['client'] && databaseService['client'].isConnected()) {
            await databaseService['client'].close();
        }
    });

    it('should instanciate correctly', (done: Mocha.Done) => {
        chai.expect(databaseService).to.be.instanceOf(DatabaseService);
        done();
    });

    it('should connect to the database when start is called', async () => {
        expect(databaseService['client']).to.not.be.undefined;
        expect(databaseService['db'].databaseName).to.equal('PolyDessin');
    });

    it('should no longer be connected if close is called', async () => {
        await databaseService.closeConnection();
        expect(databaseService['client'].isConnected()).to.be.false;
    });

    it('should add drawing to database', async () => {
        await databaseService.addDrawing(validDrawing).then((result) => {
            expect(result).to.equal(1);
        });
    });

    it('should not add drawing to database if title is invalid and there are no tag', async () => {
        await databaseService.addDrawing(invalidDrawing).then((result) => {
            expect(result).to.equal(0);
        });
    });

    it('should delete drawing from database', async () => {
        await databaseService.addDrawing(validDrawing).then(() => {
            if (validDrawing._id) {
                databaseService.deleteDrawingByIdName(validDrawing._id).then((result) => {
                    expect(result).to.equal(1);
                });
            }
        });
    });

    it('should not delete drawing from database if id is invalid', async () => {
        await databaseService.addDrawing(invalidDrawing).then(() => {
            if (invalidDrawing._id) {
                databaseService.deleteDrawingByIdName('000000000000000000000000').catch((error) => {
                    expect(error).to.equal(0);
                });
            }
        });
    });

    it('should get drawing by tags', async () => {
        const expected: Drawing[] = [{ name: '', tags: ['tag1'], imageURL: 'url' }];

        await databaseService.addDrawing(validDrawing).then(() => {
            if (validDrawing._id) {
                databaseService.getDrawingByTags('tag1').then((result) => {
                    expect(result).to.equal(expected);
                });
            }
        });
    });

    it('should convert DrawingMetaData to Drawing', () => {
        const drawingMetadata: DrawingMetadata[] = [
            {
                _id: new ObjectId('000000000000000000000000'),
                title: 'title',
                labels: ['tag1', 'tag2'],
            },
        ];
        const expectedDrawing: Drawing[] = [
            {
                name: 'title',
                tags: ['tag1', 'tag2'],
                imageURL: 'http://localhost:3000/api/database/drawings/000000000000000000000000.png',
            },
        ];

        const result = databaseService.toDrawType(drawingMetadata);
        console.log(result);
        expect(result).to.deep.equal(expectedDrawing);
    });

    it('should convert DrawingMetaData to Drawing if previewUrl and tags are undefined', () => {
        const drawingMetadata: DrawingMetadata[] = [
            {
                _id: new ObjectId(),
                title: 'title',
                labels: undefined,
            },
        ];

        const result = databaseService.toDrawType(drawingMetadata);
        console.log(result);
        expect(result).to.be.empty;
    });

    it('should return false if at least one tag from the list is invalid', () => {
        const tags: string[] = ['!nv@l!d--234'];

        const result = databaseService['validateTags'](tags);
        console.log(result);
        expect(result).to.equal(false);
    });

    it('should return false if there are more than 5 tags', () => {
        const tags: string[] = ['1', '2', '3', '4', '5', '6', '7', '8'];

        const result = databaseService['validateTags'](tags);
        expect(result).to.equal(false);
    });

    it('should return true if tags are undefined', () => {
        const tags: string[] | undefined = undefined;

        const result = databaseService['validateTags'](tags);
        expect(result).to.equal(true);
    });

    it('should return true if request body is valid', () => {
        const body = 'data:image/png;base64,imagedatahere12345';

        const result = databaseService['validateRequestBody'](body);
        expect(result).to.equal(true);
    });

    it('should return true if request is valid', () => {
        const request: DrawingData = {
            title: 'title',
            labels: ['tag'],
            width: 199,
            height: 199,
            body: 'data:image/png;base64,imagedatahere12345',
        };

        const result = databaseService['validateRequest'](request);
        expect(result).to.equal(true);
    });

    it('should split tag correctly', () => {
        const tags = 'tag1-tag2';
        const result = databaseService['splitTags'](tags);
        console.log(result);
        expect(result).to.deep.equal(['tag1', 'tag2']);
    });
});
