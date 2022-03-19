import { AfterViewInit, Component } from '@angular/core';
import { EllipseService } from '@app/services/editor/tools/ellipse/ellipse.service';
import { colors } from '@app/constants/colors'

@Component({
    selector: 'app-ellipse-config',
    templateUrl: './ellipse-config.component.html',
    styleUrls: ['./ellipse-config.component.scss'],
})
export class EllipseConfigComponent implements AfterViewInit {
    ellipseService: EllipseService;
    colors: string[];
    secondaryColorBtns: HTMLCollection;

    constructor(ellipseService: EllipseService) {
        this.ellipseService = ellipseService;
        this.colors = colors;
    }

    updateLineWidth(value: number): number {
        return value;
    }

    ngAfterViewInit(): void {
        this.secondaryColorBtns = document.getElementsByClassName('ellipseColor'); 
        for(let i = 0; i < colors.length; i++) {
          (this.secondaryColorBtns.item(i) as HTMLElement).style.backgroundColor = colors[i];
        }
    }

    changeSecondaryColorTo(color: string, div: HTMLElement): void {
        this.ellipseService.colorSecond = color;
        this.displayActiveColor(div);
    }

    displayActiveColor(div: HTMLElement): void {
        for(let i = 0; i < colors.length; i++) {
            (this.secondaryColorBtns.item(i) as HTMLElement).className = "color ellipseColor";
        }
        div.className += " selected";
    }
}
