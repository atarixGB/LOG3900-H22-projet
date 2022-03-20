import { Vec2 } from '@app/classes/vec2';
import { ToolList } from '@app/interfaces-enums/tool-list';
import { Stroke } from './stroke';


export class StrokePencil extends Stroke {
   points: Vec2[];

   constructor(boundingPoints: Vec2[], color: string, strokeWidth: number, points: Vec2[]) {
      super(ToolList.Pencil, boundingPoints, color, strokeWidth);
      this.points = points;
   }

   drawStroke(ctx: CanvasRenderingContext2D): void {
      ctx.beginPath();
      for (const point of this.points) {
         ctx.lineTo(point.x, point.y);
         ctx.lineWidth = this.strokeWidth;
      }
      ctx.strokeStyle = this.primaryColor;
      ctx.stroke();
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

   rescale(scale: Vec2): void {
       for (let i = 0; i < this.points.length; i++) {
          this.points[i].x = this.points[i].x * scale.x;
          this.points[i].y = this.points[i].y * scale.y;
       }
   }

   updateStrokeSecondaryColor(color: string): void {} 
}
