import { Injectable } from '@angular/core';
import { colors } from '@app/constants/colors'
import { TRANSPARENT } from '@app/constants/constants';

@Injectable({
    providedIn: 'root',
})
export class ColorManagerService {
    primaryColor: string;
    secondaryColor: string;

    constructor() {
        this.primaryColor = colors[2];
        this.secondaryColor = TRANSPARENT;
    }
}
