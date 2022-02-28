import { Vec2 } from '@app/classes/vec2';
import { Stroke } from './stroke';
import { drawStrokeEllipse } from './stroke-drawer';

export class StrokeEllipse extends Stroke {
   secondaryColor: string;
   center: Vec2;
   radius: Vec2;
   shapeType: string;

   constructor(boundingPoints: Vec2[], color: string, strokeWidth: number, secondaryColor: string, center: Vec2, radius: Vec2, shapeType: string) {
      super('ellipse', boundingPoints, color, strokeWidth);
      this.secondaryColor = secondaryColor;
      this.center = center;
      this.radius = radius;
      this.shapeType = shapeType;
   }

   drawStroke(ctx: CanvasRenderingContext2D): void {
      drawStrokeEllipse(this, ctx);
   }

   prepForSelection(): void {
      this.center = { x: this.center.x - this.boundingPoints[0].x, y: this.center.y - this.boundingPoints[0].y }
  }
}
