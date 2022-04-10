import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { ToolList } from '@app/interfaces-enums/tool-list';
import { EllipseService } from './ellipse/ellipse.service';
import { PencilService } from './pencil/pencil.service';
import { RectangleService } from './rectangle/rectangle.service';
import { SelectionService } from './selection/selection.service';
import { StampService } from './stamp/stamp.service';

@Injectable({
    providedIn: 'root',
})
export class ToolManagerService {
    toolList: ToolList;
    currentTool: Tool | undefined;
    currentToolEnum: ToolList | undefined;
    serviceBindings: Map<ToolList, Tool>;
    keyBindings: Map<string, Tool>;

    constructor(
        private pencilService: PencilService,
        private ellipseService: EllipseService,
        private rectangleService: RectangleService,
        private selectionService: SelectionService,
        private stampService: StampService,

    ) {
        this.currentTool = this.pencilService;
        this.currentToolEnum = ToolList.Pencil;

        this.serviceBindings = new Map<ToolList, Tool>();
        this.serviceBindings
            .set(ToolList.Pencil, this.pencilService)
            .set(ToolList.Ellipse, this.ellipseService)
            .set(ToolList.Rectangle, this.rectangleService)
            .set(ToolList.Stamp, this.stampService)
            .set(ToolList.Selection, this.selectionService)

        this.keyBindings = new Map<string, Tool>();
        this.keyBindings
            .set('c', this.pencilService)
            .set('1', this.rectangleService)
            .set('2', this.ellipseService)

        this.selectionService.toolUpdate$.subscribe((toolToSwitchTo: number) => {
            this.switchTool(toolToSwitchTo);
        });

        this.selectionService.callMouseDown$.subscribe((mouseEvent: MouseEvent) => {
            this.currentTool?.onMouseDown(mouseEvent);
        });
    }

    private getEnumFromMap(map: Map<ToolList, Tool>, searchValue: Tool | undefined): ToolList | undefined {
        for (const [key, value] of map.entries()) {
            if (value === searchValue) return key;
        }
        return undefined;
    }

    handleHotKeysShortcut(event: KeyboardEvent): void {
        if (this.currentTool && (event.key === 'Shift' || event.key === 'Backspace' || event.key === 'Escape' || event.key === 'Alt')) {
            this.currentTool.handleKeyDown(event);
        }
    }

    switchToolWithKeys(keyShortcut: string): void {
        if (this.keyBindings.has(keyShortcut)) {
            this.currentTool = this.keyBindings.get(keyShortcut);
            this.currentToolEnum = this.getEnumFromMap(this.serviceBindings, this.currentTool);
        }
    }

    switchTool(tool: ToolList): void {
        if (this.serviceBindings.has(tool)) {
            this.currentTool = this.serviceBindings.get(tool);
            this.currentToolEnum = tool;
        }
    }

    onMouseMove(event: MouseEvent, mouseCoord: Vec2): void {
        if (this.currentTool) {
            this.currentTool.mouseCoord = mouseCoord;
            this.currentTool.onMouseMove(event);
        }
    }

    onMouseDown(event: MouseEvent, mouseCoord: Vec2): void {
        if (this.currentTool) {
            this.currentTool.mouseCoord = mouseCoord;
            this.currentTool.onMouseDown(event);
        }
    }

    onMouseUp(event: MouseEvent, mouseCoord: Vec2): void {
        if (this.currentTool) {
            this.currentTool.mouseCoord = mouseCoord;
            this.currentTool.onMouseUp(event);
        }
    }

    onMouseClick(event: MouseEvent): void {
        if (this.currentTool) this.currentTool.onMouseClick(event);
    }

    onMouseDoubleClick(event: MouseEvent): void {
        if (this.currentTool) this.currentTool.onMouseDoubleClick(event);
    }

    onMouseLeave(event: MouseEvent): void {
        if (this.currentTool) this.currentTool.onMouseLeave(event);
    }

    onWheel(event: WheelEvent): void {
        if (this.currentTool) this.currentTool.onWheelEvent(event);
    }

    handleKeyUp(event: KeyboardEvent): void {
        if (this.currentTool) this.currentTool.handleKeyUp(event);
    }

}
