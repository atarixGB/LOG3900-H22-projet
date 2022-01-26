import { Component } from '@angular/core';
import { TypeOfJunctions } from '@app/interfaces-enums/junction-type';
import { LineService } from '@app/services/tools/line/line.service';
@Component({
    selector: 'app-line-config',
    templateUrl: './line-config.component.html',
    styleUrls: ['./line-config.component.scss'],
})
export class LineConfigComponent {
    lineService: LineService;
    TypeOfJunctions: typeof TypeOfJunctions = TypeOfJunctions;

    constructor(lineService: LineService) {
        this.lineService = lineService;
    }

    updateLineWidth(value: number): number {
        return value;
    }
}
