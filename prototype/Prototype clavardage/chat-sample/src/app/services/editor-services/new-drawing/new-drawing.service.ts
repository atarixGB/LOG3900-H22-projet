import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
@Injectable({
    providedIn: 'root',
})
export class NewDrawingService {
    private clean: Subject<boolean> = new Subject<boolean>();

    requestCleaning(): void {
        this.clean.next(true);
    }

    getCleanStatus(): Observable<boolean> {
        return this.clean.asObservable();
    }
}
