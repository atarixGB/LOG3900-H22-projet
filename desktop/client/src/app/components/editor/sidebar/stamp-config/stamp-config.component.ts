import { Component } from '@angular/core';
import { StampService } from '@app/services/editor/tools/stamp/stamp.service';
@Component({
    selector: 'app-stamp-config',
    templateUrl: './stamp-config.component.html',
    styleUrls: ['./stamp-config.component.scss'],
})
export class StampConfigComponent {

    constructor(public stampService: StampService) {}
}