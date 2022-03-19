import { Injectable } from '@angular/core';
import { colors } from '@app/constants/colors'

@Injectable({
    providedIn: 'root',
})
export class ColorManagerService {
    primaryColor: string;

    constructor() {
        this.primaryColor = colors[2];
    }
}
