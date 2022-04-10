export abstract class Drawable {
    // tslint:disable: no-empty // virtual method
    draw(ctx: CanvasRenderingContext2D): void {}
    undraw(): void {}
}