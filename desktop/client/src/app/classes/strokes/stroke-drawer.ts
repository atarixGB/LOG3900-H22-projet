import { StrokeEllipse } from './stroke-ellipse';
import { StrokePencil } from './stroke-pencil';
import { StrokeRectangle } from './stroke-rectangle';
import { TypeStyle } from '../../interfaces-enums/type-style';


export function drawStrokeRectangle(stroke: StrokeRectangle, ctx: CanvasRenderingContext2D): void {
   ctx.lineWidth = stroke.strokeWidth;
   ctx.beginPath();
   ctx.rect(stroke.topLeftCorner.x, stroke.topLeftCorner.y, stroke.width, stroke.height);
   if (stroke.shapeType === TypeStyle.Stroke) {
      ctx.strokeStyle = stroke.secondaryColor;
      ctx.fillStyle = 'rgba(255, 0, 0, 0)';
   } else if (stroke.shapeType === TypeStyle.Fill) {
      ctx.strokeStyle = 'rgba(255, 0, 0, 0)';
      ctx.fillStyle = stroke.primaryColor;
   } else {
      ctx.strokeStyle = stroke.secondaryColor;
      ctx.fillStyle = stroke.primaryColor;
   }
   ctx.fill();
   ctx.stroke();
}

export function drawStrokeEllipse(stroke: StrokeEllipse, ctx: CanvasRenderingContext2D): void {
   ctx.lineWidth = stroke.strokeWidth;
   ctx.beginPath();
   ctx.ellipse(stroke.center.x, stroke.center.y, stroke.radius.x, stroke.radius.y, 0, 2 * Math.PI, 0);

   if (stroke.shapeType === TypeStyle.Stroke) {
      ctx.strokeStyle = stroke.secondaryColor;
      ctx.fillStyle = 'rgba(255, 0, 0, 0)';
   } else if (stroke.shapeType === TypeStyle.Fill) {
      ctx.strokeStyle = 'rgba(255, 0, 0, 0)';
      ctx.fillStyle = stroke.primaryColor;
   } else {
      ctx.strokeStyle = stroke.secondaryColor;
      ctx.fillStyle = stroke.primaryColor;
   }
   ctx.fill();
   ctx.stroke();
}

export function drawStrokePencil(stroke: StrokePencil, ctx: CanvasRenderingContext2D): void {
   ctx.beginPath();
   if (stroke.isPoint) {
      ctx.arc(stroke.points[0].x, stroke.points[0].y, stroke.strokeWidth, 0, 2 * Math.PI, true);
      ctx.fillStyle = stroke.primaryColor;
      ctx.fill();
   } else {
      for (const point of stroke.points) {
         ctx.lineTo(point.x, point.y);
         ctx.lineWidth = stroke.strokeWidth;
      }
      ctx.strokeStyle = stroke.primaryColor;
      ctx.stroke();
   }
}
