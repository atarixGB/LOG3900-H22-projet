import { Vec2 } from '@app/classes/vec2';
import { ToolList } from '@app/interfaces-enums/tool-list';
import { TypeStyle } from '@app/interfaces-enums/type-style';
import { Stroke } from './stroke';

export class StrokeEllipse extends Stroke {
   secondaryColor: string;
   center: Vec2;
   radius: Vec2;
   shapeType: TypeStyle;

   constructor(boundingPoints: Vec2[], color: string, strokeWidth: number, secondaryColor: string, center: Vec2, radius: Vec2, shapeType: TypeStyle) {
      super(ToolList.Ellipse, boundingPoints, color, strokeWidth);
      this.secondaryColor = secondaryColor;
      this.center = center;
      this.radius = radius;
      this.shapeType = shapeType;
   }

   drawStroke(ctx: CanvasRenderingContext2D): void {
      ctx.lineWidth = this.strokeWidth;
      ctx.beginPath();
      ctx.ellipse(this.center.x, this.center.y, this.radius.x, this.radius.y, 0, 2 * Math.PI, 0);
   
      if (this.shapeType === TypeStyle.Stroke) {
         ctx.strokeStyle = this.secondaryColor;
         ctx.fillStyle = 'rgba(255, 0, 0, 0)';
      } else if (this.shapeType === TypeStyle.Fill) {
         ctx.strokeStyle = 'rgba(255, 0, 0, 0)';
         ctx.fillStyle = this.primaryColor;
      } else {
         ctx.strokeStyle = this.secondaryColor;
         ctx.fillStyle = this.primaryColor;
      }
      ctx.fill();
      ctx.stroke();
   }

   prepForSelection(): void {
      this.center = { x: this.center.x - this.boundingPoints[0].x, y: this.center.y - this.boundingPoints[0].y }
   }

   prepForBaseCanvas(selectionTopLeftCorner: Vec2, selectionSize: Vec2): void {
      this.center = { x: this.center.x + selectionTopLeftCorner.x, y: this.center.y + selectionTopLeftCorner.y }
      const bottomRightCorner = { x: selectionTopLeftCorner.x + selectionSize.x, y: selectionTopLeftCorner.y + selectionSize.y };
      this.boundingPoints = [selectionTopLeftCorner, bottomRightCorner];
   }
}
