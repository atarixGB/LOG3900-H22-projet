import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
// import { CarouselComponent } from '@app/components/carousel/carousel-modal/carousel.component';
import { AutoSaveService } from '@app/services/editor/auto-save/auto-save.service';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
    readonly title: string = 'Polygram';
    readonly EDITOR_ROUTE: string = 'http://localhost:4200/editor';
    isDisabled: boolean;

    constructor(public dialog: MatDialog, private autoSaveService: AutoSaveService) {
        this.isDisabled = true;
    }

    ngOnInit(): void {
        this.isDisabled = this.autoSaveService.localStorageIsEmpty();
    }

    continueDrawing(): void {
        this.autoSaveService.loadImage();
        this.changeLocation();
    }

    clearLocalStorage(): void {
        this.autoSaveService.clearLocalStorage();
    }

    private changeLocation(): void {
        window.location.replace(this.EDITOR_ROUTE);
    }
}
