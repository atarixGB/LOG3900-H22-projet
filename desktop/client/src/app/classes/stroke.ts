
export abstract class Stroke {
   primaryColor: string;
   strokeWidth: number;

   constructor(color:string, width:number) {
      this.primaryColor = color;
      this.strokeWidth = width;
   }
}