import { Component } from '@angular/core';
import { PencilService } from '@app/services/editor/tools/pencil/pencil.service';

@Component({
    selector: 'app-pencil-config',
    templateUrl: './pencil-config.component.html',
    styleUrls: ['./pencil-config.component.scss'],
})
export class PencilConfigComponent {
    constructor(public pencilService: PencilService) {}

    formatLabel(value: number): string {
        return value + 'px';
    }
}
