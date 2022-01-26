import { AfterViewInit, Component, HostListener, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Utils } from '@app/classes/utils/math-utils';
import { DrawingParams } from '@app/interfaces-enums/drawing-params';
import { AutoSaveService } from '@app/services/auto-save/auto-save.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { IndexService } from '@app/services/index/index.service';
import { Drawing } from '@common/communication/drawing';
import { DrawingData } from '@common/communication/drawing-data';

@Component({
    selector: 'app-carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements AfterViewInit {
    isLoading: boolean;
    placement: Drawing[];
    tags: string[];
    tagInput: string;
    drawings: Drawing[];

    private readonly URL_POSITION: number = 4;
    private index: number;
    private mainDrawingURL: string;
    private decision: boolean;

    constructor(
        public indexService: IndexService,
        private router: Router,
        private dialogRef: MatDialogRef<CarouselComponent>,
        private drawingService: DrawingService,
        private autoSaveService: AutoSaveService,
        @Inject(MAT_DIALOG_DATA) public isCanvaEmpty: boolean,
    ) {
        this.index = 0;
        this.drawings = [];
        this.placement = [];
        this.tags = [];
        this.isLoading = true;
        this.mainDrawingURL = '';
        this.tagInput = '';
        this.decision = false;
    }

    addTag(): void {
        const trimmedTag: string = this.tagInput.trim();
        this.tags.push(trimmedTag);
        this.tagInput = '';
        this.searchbyTags();
    }

    removeTag(tag: string): void {
        this.tags = this.tags.filter((current) => current !== tag);
        this.searchbyTags();
    }

    nextImages(): void {
        this.index++;
        this.updateImagePlacement();
        this.updateMainImageURL();
    }
    previousImages(): void {
        this.index--;
        this.updateImagePlacement();
        this.updateMainImageURL();
    }

    loadImage(): void {
        if (this.isCanvaEmpty === null) {
            this.isCanvaEmpty = true;
        }
        if (!this.isCanvaEmpty) {
            this.decision = confirm('Voulez-vous abandonner votre dessin ?');
            if (this.decision) {
                this.openEditorWithDrawing();
            }
        } else {
            this.openEditorWithDrawing();
        }
    }

    @HostListener('document:keydown', ['$event'])
    handleKeyDown(event: KeyboardEvent): void {
        if (event.code === 'ArrowLeft') {
            this.previousImages();
        }
        if (event.code === 'ArrowRight') {
            this.nextImages();
        }
    }

    async ngAfterViewInit(): Promise<void> {
        this.fetchDrawings();
    }

    async searchbyTags(): Promise<void> {
        this.isLoading = true;
        let drawingFromDB = [] as Drawing[];
        let urlFromServer = [] as string[];

        await this.indexService.searchByTags(this.tags).then((drawings: Drawing[]) => {
            drawingFromDB = drawings;
        });

        await this.indexService.getAllDrawingsFromLocalServer().then((url: string[]) => {
            urlFromServer = url;
        });

        this.drawings = this.findAvailableImages(urlFromServer, drawingFromDB);
        this.isLoading = false;
        this.updateImagePlacement();
        this.updateMainImageURL();
    }

    async deleteDrawing(): Promise<void> {
        const path = (url: string): string => {
            let parseUrl = new URL(url).pathname;
            parseUrl = parseUrl.split('/')[this.URL_POSITION].split('.')[0];
            return parseUrl;
        };
        this.indexService.deleteDrawingById(path(this.mainDrawingURL)).then(() => {
            this.fetchDrawings();
        });
        // .catch((error) => {
        //     alert(`Un problème avec le serveur est survenu. Le dessin n'a pas pu être supprimé. Veuillez réessayer.\nError ${error}`);
        // });
    }

    private openEditorWithDrawing(): void {
        const params: DrawingParams = {
            url: this.mainDrawingURL,
        };
        this.router.navigate(['/'], { skipLocationChange: true }).then(() => this.router.navigate(['editor', params]));
        this.dialogRef.close();

        const drawing: DrawingData = {
            title: '',
            width: this.drawingService.canvas.width,
            height: this.drawingService.canvas.height,
            body: this.drawingService.canvas.toDataURL(),
        };
        this.autoSaveService.saveCanvasState(drawing);
    }

    private async fetchDrawings(): Promise<void> {
        this.isLoading = true;
        let urlFromServer: string[] = [];
        let drawingFromDB: Drawing[] = [];

        await this.indexService.getAllDrawingsFromDB().then((drawings: Drawing[]) => {
            drawingFromDB = drawings;
        });

        await this.indexService.getAllDrawingsFromLocalServer().then((url: string[]) => {
            urlFromServer = url;
        });

        this.drawings = this.findAvailableImages(urlFromServer, drawingFromDB);
        this.isLoading = false;
        this.updateImagePlacement();
        this.updateMainImageURL();
    }

    private updateImagePlacement(): void {
        this.placement[0] = this.drawings[Utils.mod(this.index - 1, this.drawings.length)];
        this.placement[1] = this.drawings[Utils.mod(this.index, this.drawings.length)];
        this.placement[2] = this.drawings[Utils.mod(this.index + 1, this.drawings.length)];
    }

    private updateMainImageURL(): void {
        if (this.placement[1] && this.placement[1].imageURL !== undefined) {
            this.mainDrawingURL = this.placement[1].imageURL;
        }
    }

    private findAvailableImages(urlFromServer: string[], drawingFromDB: Drawing[]): Drawing[] {
        const availableImages = [];
        for (const url of urlFromServer) {
            for (const drawing of drawingFromDB) {
                if (drawing.imageURL === url) {
                    availableImages.push(drawing);
                }
            }
        }
        return availableImages;
    }
}
