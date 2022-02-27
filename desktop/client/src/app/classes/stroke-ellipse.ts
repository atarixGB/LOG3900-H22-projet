import { Stroke } from './stroke';
import { Vec2 } from './vec2';

export class StrokeEllipse extends Stroke {
   secondaryColor: string;
   center: Vec2;
   radius: Vec2;
   shapeType: string;

   constructor(color: string, strokeWidth: number, secondaryColor: string, center: Vec2, radius: Vec2, shapeType: string) {
      super('ellipse', color, strokeWidth);
      this.secondaryColor = secondaryColor;
      this.center = center;
      this.radius = radius;
      this.shapeType = shapeType;
   }
}
