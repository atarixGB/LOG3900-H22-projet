import { Component } from '@angular/core';
import { ToolList } from '@app/interfaces-enums/tool-list';
import { AlbumGalleryService } from '@app/services/album-gallery/album-gallery.service';
import { CollaborationService } from '@app/services/collaboration/collaboration.service';
import { SelectionService } from '@app/services/editor/tools/selection/selection.service';
import { ToolManagerService } from '@app/services/editor/tools/tool-manager.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    ToolList: typeof ToolList = ToolList;
    constructor(public toolManagerService: ToolManagerService, public selectionService: SelectionService, public collaborationService: CollaborationService, public albumGalleryService: AlbumGalleryService) {}

    saveAndLeave(): void {
        if (this.selectionService.isActiveSelection) {
            this.selectionService.pasteSelectionOnBaseCnv();
        }
        if (this.collaborationService.nbMembersInCollab == 1) {
            this.albumGalleryService.saveDrawing();
        }
        this.collaborationService.leaveCollab();
    }    
}

