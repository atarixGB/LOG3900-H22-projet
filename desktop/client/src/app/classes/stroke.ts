export abstract class Stroke {
    toolType: string;
    primaryColor: string;
    strokeWidth: number;

    constructor(tool: string, color: string, width: number) {
        this.toolType = tool;
        this.primaryColor = color;
        this.strokeWidth = width;
    }
}
