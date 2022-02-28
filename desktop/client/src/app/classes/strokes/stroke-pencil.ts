import { Vec2 } from '@app/classes/vec2';
import { Stroke } from './stroke';
import { drawStrokePencil } from './stroke-drawer';


export class StrokePencil extends Stroke {
   points: Vec2[];
   isPoint: boolean;

   constructor(boundingPoints: Vec2[], color: string, strokeWidth: number, points: Vec2[], isPoint: boolean) {
      super('pencil', boundingPoints, color, strokeWidth);
      this.points = points;
      this.isPoint = isPoint;
   }

   drawStroke(ctx: CanvasRenderingContext2D): void {
      drawStrokePencil(this, ctx);
   }
}
