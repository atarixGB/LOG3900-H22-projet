import { Vec2 } from '@app/classes/vec2';
import { Stroke } from './stroke';


export class StrokePencil extends Stroke {
   points: Vec2[];
   isPoint: boolean;

   constructor(color: string, strokeWidth: number, points: Vec2[], isPoint: boolean) {
      super('pencil', color, strokeWidth);
      this.points = points;
      this.isPoint = isPoint;
   }
}
