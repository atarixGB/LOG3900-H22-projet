import { Vec2 } from '@app/classes/vec2';
import { Stroke } from './stroke';

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
