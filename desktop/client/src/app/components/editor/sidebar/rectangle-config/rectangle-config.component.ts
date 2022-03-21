import { AfterViewInit, Component } from '@angular/core';
import { RectangleService } from '@app/services/editor/tools/rectangle/rectangle.service';
import { BIGGEST_STROKE_WIDTH, NUMBER_WIDTH_CHOICES } from '@app/constants/constants';

@Component({
    selector: 'app-rectangle-config',
    templateUrl: './rectangle-config.component.html',
    styleUrls: ['./rectangle-config.component.scss'],
})
export class RectangleConfigComponent implements AfterViewInit {
    widthBtns: HTMLCollection;

    constructor(public rectangleService: RectangleService) {}

    ngAfterViewInit(): void {
        const circleDiam = (document.getElementById('circle') as HTMLElement).offsetHeight;
        this.widthBtns = document.getElementsByClassName('thicknessR'); 
        let diam = '';
        for(let i = 0; i < NUMBER_WIDTH_CHOICES; i++) {
            diam = ((i+1)/NUMBER_WIDTH_CHOICES * circleDiam).toString() + 'px';
            (this.widthBtns.item(i) as HTMLElement).style.width = diam;
            (this.widthBtns.item(i) as HTMLElement).style.height = diam;
        }
    }

    changeWidth(widthChoice: number): void {
        this.rectangleService.selectedWidth = widthChoice;
        this.rectangleService.lineWidth = widthChoice/NUMBER_WIDTH_CHOICES * BIGGEST_STROKE_WIDTH;
    }
}
