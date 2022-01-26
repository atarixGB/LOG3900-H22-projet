import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-slider',
    templateUrl: './slider.component.html',
    styleUrls: ['./slider.component.scss'],
})
export class SliderComponent {
    @Input() min: number;
    @Input() max: number;
    @Input() step: number;
    @Input() value: number;
    @Input() title: string;

    @Output() valueChange: EventEmitter<number> = new EventEmitter();

    changeValue(): void {
        this.valueChange.emit(this.value);
    }
}
