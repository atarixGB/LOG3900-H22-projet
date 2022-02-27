import { Stroke } from './stroke';
import { Vec2 } from './vec2';

export class StrokePencil extends Stroke {
   points: Vec2[];

   constructor(color: string, strokeWidth: number, points: Vec2[]) {
      super('pencil', color, strokeWidth);
      this.points = points;
   }
}
