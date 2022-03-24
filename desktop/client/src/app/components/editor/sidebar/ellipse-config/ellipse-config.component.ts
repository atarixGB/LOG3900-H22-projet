import { AfterViewInit, Component } from '@angular/core';
import { EllipseService } from '@app/services/editor/tools/ellipse/ellipse.service';
import { BIGGEST_STROKE_WIDTH, NUMBER_WIDTH_CHOICES } from '@app/constants/constants';

@Component({
    selector: 'app-ellipse-config',
    templateUrl: './ellipse-config.component.html',
    styleUrls: ['./ellipse-config.component.scss'],
})
export class EllipseConfigComponent implements AfterViewInit{
    widthBtns: HTMLCollection;

    constructor(public ellipseService: EllipseService) {}

    ngAfterViewInit(): void {
        const circleDiam = (document.getElementById('circle') as HTMLElement).offsetHeight;
        this.widthBtns = document.getElementsByClassName('thicknessE'); 
        let diam = '';
        for(let i = 0; i < NUMBER_WIDTH_CHOICES; i++) {
            diam = ((i+1)/NUMBER_WIDTH_CHOICES * circleDiam).toString() + 'px';
            (this.widthBtns.item(i) as HTMLElement).style.width = diam;
            (this.widthBtns.item(i) as HTMLElement).style.height = diam;
        }
    }

    changeWidth(widthChoice: number): void {
        this.ellipseService.selectedWidth = widthChoice;
        this.ellipseService.lineWidth = widthChoice/NUMBER_WIDTH_CHOICES * BIGGEST_STROKE_WIDTH;
    }
}
