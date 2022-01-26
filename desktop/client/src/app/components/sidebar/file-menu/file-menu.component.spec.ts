import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { ExportModalComponent } from '@app/components/export-modal/export-modal.component';
import { NewDrawModalComponent } from '@app/components/new-draw-modal/new-draw-modal.component';
import { SaveDrawingModalComponent } from '@app/components/save-drawing-modal/save-drawing-modal.component';
import { ExportService } from '@app/services/export-image/export.service';
import { IndexService } from '@app/services/index/index.service';
import { SelectionService } from '@app/services/tools/selection/selection.service';
import { FileMenuComponent } from './file-menu.component';

// tslint:disable
describe('FileMenuComponent', () => {
    let component: FileMenuComponent;
    let fixture: ComponentFixture<FileMenuComponent>;
    let indexServiceSpy: jasmine.SpyObj<IndexService>;
    let exportServiceSpy: jasmine.SpyObj<ExportService>;
    let selectionServiceSpy: jasmine.SpyObj<SelectionService>;
    const dialogSpy = {
        open: jasmine.createSpy('open'),
    };

    beforeEach(async(() => {
        exportServiceSpy = jasmine.createSpyObj('ExportService', ['imagePrevisualization', 'initializeExportParams']);
        selectionServiceSpy = jasmine.createSpyObj('SelectionService', ['terminateSelection']);

        TestBed.configureTestingModule({
            declarations: [FileMenuComponent, NewDrawModalComponent],
            imports: [MatIconModule, MatDialogModule, MatGridListModule],
            providers: [
                {
                    provide: MatDialog,
                    useValue: dialogSpy,
                },
                {
                    provide: IndexService,
                    useValue: indexServiceSpy,
                },
                {
                    provide: ExportService,
                    useValue: exportServiceSpy,
                },
                {
                    provide: SelectionService,
                    useValue: selectionServiceSpy,
                },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FileMenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should open modal window to confirm creating a new drawing', () => {
        component.handleCreateDraw();
        expect(selectionServiceSpy.terminateSelection).toHaveBeenCalled();
        expect(NewDrawModalComponent).toBeTruthy();
        expect(dialogSpy.open).toHaveBeenCalled();
    });

    it('should open modal window to save drawing', () => {
        component.handleSaveDrawing();
        expect(selectionServiceSpy.terminateSelection).toHaveBeenCalled();
        expect(SaveDrawingModalComponent).toBeTruthy();
        expect(dialogSpy.open).toHaveBeenCalled();
    });

    it('should open modal window to export drawing', () => {
        component.handleExportDrawing();
        expect(ExportModalComponent).toBeTruthy();
        expect(selectionServiceSpy.terminateSelection).toHaveBeenCalled();
        expect(dialogSpy.open).toHaveBeenCalled();
        expect(exportServiceSpy.imagePrevisualization).toHaveBeenCalled();
        expect(exportServiceSpy.initializeExportParams).toHaveBeenCalled();
    });
});
