import { Injectable } from '@angular/core';
import { colors } from '@app/constants/colors'

@Injectable({
    providedIn: 'root',
})
export class ColorManagerService {
    primaryColor: string;
    secondaryColor: string;

    constructor() {
        this.primaryColor = colors[2];
        this.secondaryColor = colors[2];
    }

    changePrimaryColorTo(newPrimary: string): void {
        this.primaryColor = newPrimary;
    }

    changeSecondaryColorTo(newSecondary: string): void {

    }
}
