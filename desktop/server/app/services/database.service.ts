import { DrawingMetadata } from '@app/classes/drawing-metadata';
import {
    ALPHANUMERIC_REGEX,
    BASE_URL,
    DATABASE_DRAWINGS_COLLECTION,
    DATABASE_MONGO_URL,
    DATABASE_NAME,
    DATABASE_URL,
    DATA_ENCODING,
    DATA_URL_BASE64_PREFIX,
    DRAWINGS_URL,
    IMAGE_FORMAT,
    MAX_LENGTH_INPUT,
    MIN_LENGTH_TITLE,
    NB_TAGS_ALLOWED,
    RESPONSE_ERROR,
    RESPONSE_SUCCESS,
    SAVED_DRAWINGS_PATH,
} from '@app/constants';
import { Drawing } from '@common/communication/drawing';
import { DrawingData } from '@common/communication/drawing-data';
import * as fs from 'fs';
import { injectable } from 'inversify';
import { Collection, Db, MongoClient, MongoClientOptions, ObjectId } from 'mongodb';
import 'reflect-metadata';

@injectable()
export class DatabaseService {
    drawingsCollection: Collection<DrawingMetadata>;
    clientMessages: DrawingData[];
    drawingURLS: string[];
    private db: Db;
    private client: MongoClient;
    private options: MongoClientOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    constructor() {
        this.clientMessages = [];
        this.drawingURLS = [];

        if (!fs.existsSync(SAVED_DRAWINGS_PATH)) {
            fs.mkdirSync(SAVED_DRAWINGS_PATH);
            console.log(`${SAVED_DRAWINGS_PATH} a été créé avec succès!`);
        } else {
            console.log(`${SAVED_DRAWINGS_PATH} existe déjà sur le serveur.`);
        }

        this.readDrawingDirectory();
    }

    toDrawType(data: DrawingMetadata[]): Drawing[] {
        const drawings = [];
        for (const drawing of data) {
            const previewUrl = drawing._id?.toHexString();
            const tag = drawing.labels;
            if (previewUrl !== undefined && tag !== undefined) {
                const draw: Drawing = {
                    name: drawing.title,
                    tags: tag,
                    imageURL: `${BASE_URL}${DATABASE_URL}${DRAWINGS_URL}/${previewUrl}.${IMAGE_FORMAT}`,
                };
                drawings.push(draw);
            }
        }
        return drawings;
    }

    async start(url: string = DATABASE_MONGO_URL): Promise<MongoClient | null> {
        try {
            this.client = await MongoClient.connect(url, this.options);
            this.db = this.client.db(DATABASE_NAME);
            this.drawingsCollection = this.db.collection(DATABASE_DRAWINGS_COLLECTION);
        } catch {
            throw new Error('Erreur de connexion avec la base de données.');
        }

        return this.client;
    }

    async closeConnection(): Promise<void> {
        return this.client.close();
    }

    async addDrawing(drawingData: DrawingData): Promise<number> {
        const drawingMetadata: DrawingMetadata = {
            title: drawingData.title,
            labels: drawingData.labels ? drawingData.labels : undefined,
        };

        if (!this.validateRequest(drawingData)) {
            return RESPONSE_ERROR;
        }

        return this.drawingsCollection
            .insertOne(drawingMetadata)
            .then((result) => {
                drawingData._id = result.insertedId.toHexString();
                this.saveImageAsPNG(drawingData);
                console.log(`Le dessin ${drawingData.title} a été ajouté avec succès!`);
                return RESPONSE_SUCCESS;
            })
            .catch((error: Error) => {
                console.error(`Échec de l'ajout du dessin ${drawingData.title} à la base de données`, error);
                return RESPONSE_ERROR;
            });
    }

    async deleteDrawingByIdName(id: string): Promise<number> {
        const objectId = new ObjectId(id);
        return this.drawingsCollection
            .findOneAndDelete({ _id: objectId })
            .then(() => {
                this.deleteDrawingFromServer(id);
                console.log(`Le dessin avec le id:${id} a été supprimé de la base de données avec succès.`);
                return RESPONSE_SUCCESS;
            })
            .catch((error) => {
                console.log(`Échec de la suppression du dessin ${id}\n${error}`);
                return RESPONSE_ERROR;
            });
    }

    async getDrawingByTags(tags: string): Promise<Drawing[]> {
        return new Promise<Drawing[]>((resolve) => {
            const split = this.splitTags(tags);
            this.drawingsCollection
                .find({ labels: { $in: split } })
                .toArray()
                .then((result) => {
                    resolve(this.toDrawType(result));
                });
        });
    }

    private parseImageData(drawingData: DrawingData): Buffer {
        const metadata = drawingData.body.replace(DATA_URL_BASE64_PREFIX, '');
        const dataBuffer = Buffer.from(metadata, DATA_ENCODING);
        return dataBuffer;
    }

    private saveImageAsPNG(drawingData: DrawingData): void {
        const dataBuffer = this.parseImageData(drawingData);
        fs.writeFile(SAVED_DRAWINGS_PATH + drawingData._id + `.${IMAGE_FORMAT}`, dataBuffer, (error) => {
            if (error) throw error;
            this.drawingURLS.push(`${BASE_URL}${DATABASE_URL}${DRAWINGS_URL}/${drawingData._id}.${IMAGE_FORMAT}`);
            this.clientMessages.push(drawingData);
        });
    }

    private deleteDrawingFromServer(id: string): void {
        const url = SAVED_DRAWINGS_PATH + id + `.${IMAGE_FORMAT}`;
        fs.unlink(url, (error) => {
            if (error) {
                throw error;
            } else {
                console.log(`Le dessin avec l'id ${id} a été supprimé du serveur avec succès`);
                this.readDrawingDirectory();
            }
        });
    }

    private validateRequestBody(body: string): boolean {
        return DATA_URL_BASE64_PREFIX.test(body);
    }

    private validateString(str: string, minLength: number): boolean {
        const isAlphanumeric = ALPHANUMERIC_REGEX.test(str);
        const isValidSize = str.length >= minLength && str.length <= MAX_LENGTH_INPUT;
        return isValidSize && isAlphanumeric;
    }

    private validateTags(tags: string[] | undefined): boolean {
        if (tags) {
            if (tags.length < 0 || tags.length > NB_TAGS_ALLOWED) return false;
            for (const tag of tags) {
                if (!this.validateString(tag, 0)) {
                    return false;
                }
            }
        }
        return true;
    }

    private validateRequest(request: DrawingData): boolean {
        return this.validateString(request.title, MIN_LENGTH_TITLE) && this.validateRequestBody(request.body) && this.validateTags(request.labels);
    }

    private readDrawingDirectory(): void {
        this.drawingURLS = [];
        fs.readdir(SAVED_DRAWINGS_PATH, (error, files) => {
            if (error) throw error;
            files.forEach((file) => {
                this.drawingURLS.push(`${BASE_URL}${DATABASE_URL}${DRAWINGS_URL}/${file}`);
            });
            console.log('Dessins actuellement sur le serveur:', this.drawingURLS);
        });
    }

    private splitTags(tag: string): string[] {
        return tag.split('-');
    }
}
