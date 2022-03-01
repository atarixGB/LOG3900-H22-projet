import { Vec2 } from '@app/classes/vec2';
import { ToolList } from '@app/interfaces-enums/tool-list';
import { Stroke } from './stroke';


export class StrokePencil extends Stroke {
   points: Vec2[];
   isPoint: boolean;

   constructor(boundingPoints: Vec2[], color: string, strokeWidth: number, points: Vec2[], isPoint: boolean) {
      super(ToolList.Pencil, boundingPoints, color, strokeWidth);
      this.points = points;
      this.isPoint = isPoint;
   }

   drawStroke(ctx: CanvasRenderingContext2D): void {
      ctx.beginPath();
      if (this.isPoint) {
         ctx.arc(this.points[0].x, this.points[0].y, this.strokeWidth, 0, 2 * Math.PI, true);
         ctx.fillStyle = this.primaryColor;
         ctx.fill();
      } else {
         for (const point of this.points) {
            ctx.lineTo(point.x, point.y);
            ctx.lineWidth = this.strokeWidth;
         }
         ctx.strokeStyle = this.primaryColor;
         ctx.stroke();
      }
   }

   prepForSelection(): void {
      for (let i = 0; i < this.points.length; i++) {
         this.points[i].x = this.points[i].x - this.boundingPoints[0].x;
         this.points[i].y = this.points[i].y - this.boundingPoints[0].y;
      }
  }

  prepForBaseCanvas(selectionTopLeftCorner: Vec2, selectionSize: Vec2): void {
      for (let i = 0; i < this.points.length; i++) {
         this.points[i].x = this.points[i].x + selectionTopLeftCorner.x;
         this.points[i].y = this.points[i].y + selectionTopLeftCorner.y;
      }
      const bottomRightCorner = { x: selectionTopLeftCorner.x + selectionSize.x, y: selectionTopLeftCorner.y + selectionSize.y };
      this.boundingPoints = [selectionTopLeftCorner, bottomRightCorner];
  }
}
