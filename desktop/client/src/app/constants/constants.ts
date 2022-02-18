import { RGBA } from '@app/interfaces-enums/rgba';

export const MIN_SIZE = 250;
export const MAX_DEC_RANGE = 255;
export const CONTROLPOINTSIZE = 10;
export const DEFAULT_LINE_THICKNESS = 1;
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

export const FIRSTCOLORTEST: RGBA = {
    Dec: { Red: 255, Green: 255, Blue: 255, Alpha: 1 },
    Hex: { Red: 'ff', Green: 'ff', Blue: 'ff' },
    inString: 'rgba(255, 255, 255, 1)',
};
export const SECONDCOLORTEST: RGBA = {
    Dec: { Red: 255, Green: 255, Blue: 255, Alpha: 1 },
    Hex: { Red: 'ff', Green: 'ff', Blue: 'ff' },
    inString: 'rgba(255, 255, 255, 1)',
};
