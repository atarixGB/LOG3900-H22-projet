import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { PipetteService } from '@app/services/tools/pipette/pipette.service';

@Component({
    selector: 'app-pipette-config',
    templateUrl: './pipette.component.html',
    styleUrls: ['./pipette.component.scss'],
})
export class PipetteComponent implements AfterViewInit {
    @ViewChild('zoom', { static: false }) zoom: ElementRef;

    zoomCtx: CanvasRenderingContext2D;

    constructor(public pipetteService: PipetteService) {}

    ngAfterViewInit(): void {
        this.zoomCtx = this.zoom.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.pipetteService.zoomCtx = this.zoomCtx;
        this.pipetteService.zoom = this.zoom.nativeElement;
    }
}
