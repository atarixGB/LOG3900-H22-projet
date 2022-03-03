import { Injectable } from '@angular/core';
import { ICollabSelection } from '@app/interfaces-enums/ICollabSelection';
import { SelectionService } from './selection.service';

@Injectable({
  providedIn: 'root'
})
export class CollabSelectionService {
  selections: ICollabSelection[];

  constructor(private selectionService: SelectionService) {
    this.selections = [];
  }
}
