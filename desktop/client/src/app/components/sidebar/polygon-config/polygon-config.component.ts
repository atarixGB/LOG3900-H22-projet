import { Component } from '@angular/core';
import { PolygonService } from 'src/app/services/tools/polygon/polygon.service';

const INITIAL_SIDES = 3;

@Component({
    selector: 'app-polygon-config',
    templateUrl: './polygon-config.component.html',
    styleUrls: ['./polygon-config.component.scss'],
})
export class PolygonConfigComponent {
    polygonService: PolygonService;
    sides: number;

    constructor(polygonService: PolygonService) {
        this.polygonService = polygonService;
        this.sides = INITIAL_SIDES;
    }

    updateLineWidth(value: number): number {
        return value;
    }
    getSides(sides: number): void {
        this.sides = sides;
        this.polygonService.sides = this.sides;
    }
}
