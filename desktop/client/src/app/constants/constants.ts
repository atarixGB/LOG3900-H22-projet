export const CNV_WIDTH = 1200;
export const CNV_HEIGTH = 1000;
export const MAX_DEC_RANGE = 255;
export const CONTROLPOINTSIZE = 10;
export const NUMBER_WIDTH_CHOICES = 9;
export const BIGGEST_STROKE_WIDTH = 30;
export const DEFAULT_LINE_THICKNESS = (1 / NUMBER_WIDTH_CHOICES) * BIGGEST_STROKE_WIDTH;
export const TRANSPARENT = 'rgba(0, 0, 0, 0)';

export enum MouseButton {
    Left = 0,
    Middle = 1,
    Right = 2,
    Back = 3,
    Forward = 4,
}

export enum MouseDirection {
    UpperLeft = 0,
    UpperRight = 1,
    LowerLeft = 2,
    LowerRight = 3,
}
