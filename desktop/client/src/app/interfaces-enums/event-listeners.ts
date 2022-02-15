export interface EventListeners {
    mouseDown: (event: MouseEvent) => boolean | void;
    changedMouseDown: boolean;
    contextMenu: (event: MouseEvent) => boolean | void;
    changedContextMenu: boolean;
}
