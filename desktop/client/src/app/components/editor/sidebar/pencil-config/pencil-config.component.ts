import { AfterViewInit, Component } from '@angular/core';
import { PencilService } from '@app/services/editor/tools/pencil/pencil.service';
import { BIGGEST_STROKE_WIDTH, NUMBER_WIDTH_CHOICES } from '@app/constants/constants';


@Component({
    selector: 'app-pencil-config',
    templateUrl: './pencil-config.component.html',
    styleUrls: ['./pencil-config.component.scss'],
})
export class PencilConfigComponent implements AfterViewInit {
    widthBtns: HTMLCollection;

    constructor(public pencilService: PencilService) {}

    ngAfterViewInit(): void {
        const circleDiam = (document.getElementById('circle') as HTMLElement).offsetHeight;
        this.widthBtns = document.getElementsByClassName('thicknessP'); 
        let diam = '';
        for(let i = 0; i < NUMBER_WIDTH_CHOICES; i++) {
            diam = ((i+1)/NUMBER_WIDTH_CHOICES * circleDiam).toString() + 'px';
            (this.widthBtns.item(i) as HTMLElement).style.width = diam;
            (this.widthBtns.item(i) as HTMLElement).style.height = diam;
        }
    }

    changeWidth(widthChoice: number): void {
        this.pencilService.selectedWidth = widthChoice;
        this.pencilService.pencilThickness = widthChoice/NUMBER_WIDTH_CHOICES * BIGGEST_STROKE_WIDTH;
    }
}
