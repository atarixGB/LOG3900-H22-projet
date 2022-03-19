import { AfterViewInit, Component } from '@angular/core';
import { RectangleService } from '@app/services/editor/tools/rectangle/rectangle.service';
import { colors } from '@app/constants/colors'

@Component({
    selector: 'app-rectangle-config',
    templateUrl: './rectangle-config.component.html',
    styleUrls: ['./rectangle-config.component.scss'],
})
export class RectangleConfigComponent implements AfterViewInit {
    rectangleService: RectangleService;
    colors: string[];
    secondaryColorBtns: HTMLCollection;
    

    constructor(rectangleService: RectangleService) {
        this.rectangleService = rectangleService;
        this.colors = colors;
    }

    updateLineWidth(value: number): number {
        return value;
    }

    ngAfterViewInit(): void {
        this.secondaryColorBtns = document.getElementsByClassName('rectColor'); 
        for(let i = 0; i < colors.length; i++) {
          (this.secondaryColorBtns.item(i) as HTMLElement).style.backgroundColor = colors[i];
        }
    }

    changeSecondaryColorTo(color: string, div: HTMLElement): void {
        this.rectangleService.colorSecond = color;
        this.displayActiveColor(div);
    }

    displayActiveColor(div: HTMLElement): void {
        for(let i = 0; i < colors.length; i++) {
            (this.secondaryColorBtns.item(i) as HTMLElement).className = "color rectColor";
        }
        div.className += " selected";
    }
}
