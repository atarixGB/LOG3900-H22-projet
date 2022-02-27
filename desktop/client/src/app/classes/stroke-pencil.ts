import { Stroke } from './stroke';
import { Vec2 } from './vec2';

export class StrokePencil extends Stroke {
   points: Vec2[];
   isPoint: boolean;

   constructor(color: string, strokeWidth: number, points: Vec2[], isPoint: boolean) {
      super('pencil', color, strokeWidth);
      this.points = points;
      this.isPoint = isPoint;
   }
}
