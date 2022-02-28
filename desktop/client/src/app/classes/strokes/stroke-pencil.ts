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

   prepForSelection(): void {
      for (let i = 0; i < this.points.length; i++) {
         this.points[i].x = this.points[i].x - this.boundingPoints[0].x;
         this.points[i].y = this.points[i].y - this.boundingPoints[0].y;
      }
  }
}
