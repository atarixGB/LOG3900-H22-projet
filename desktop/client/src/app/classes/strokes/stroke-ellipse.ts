import { Vec2 } from '@app/classes/vec2';
import { ToolList } from '@app/interfaces-enums/tool-list';
import { Stroke } from './stroke';

export class StrokeEllipse extends Stroke {
   secondaryColor: string;
   center: Vec2;
   radius: Vec2;
   isSecondColorTransparent: boolean;

   constructor(boundingPoints: Vec2[], color: string, strokeWidth: number, secondaryColor: string, center: Vec2, radius: Vec2, isSecondColorTransparent: boolean) {
      super(ToolList.Ellipse, boundingPoints, color, strokeWidth);
      this.secondaryColor = secondaryColor;
      this.center = center;
      this.radius = radius;
      this.isSecondColorTransparent = isSecondColorTransparent;
   }

   drawStroke(ctx: CanvasRenderingContext2D): void {
      ctx.lineWidth = this.strokeWidth;
      ctx.beginPath();
      ctx.ellipse(this.center.x, this.center.y, this.radius.x, this.radius.y, 0, 2 * Math.PI, 0);
      ctx.fillStyle = this.isSecondColorTransparent ? 'rgba(0, 0, 0, 0)' : this.secondaryColor;
      ctx.strokeStyle = this.primaryColor;
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

   rescale(scale: Vec2): void {
      this.center = { x: this.center.x * scale.x, y: this.center.y * scale.y }
      this.radius = { x: this.radius.x * scale.x, y: this.radius.y * scale.y }
   }
}
