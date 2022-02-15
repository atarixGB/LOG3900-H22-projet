export interface RGBA {
    Dec: {
        Red: number;
        Green: number;
        Blue: number;
        Alpha: number;
    };
    Hex: {
        Red: string;
        Green: string;
        Blue: string;
    };
    inString: string;
}

export interface DecimalRGBA {
    RED: number;
    GREEN: number;
    BLUE: number;
    ALPHA: number;
}

export const RGBA_INDEX: DecimalRGBA = {
    RED: 0,
    GREEN: 1,
    BLUE: 2,
    ALPHA: 3,
};
