export declare const enum Coordinate {
    X = 0,
    Y = 1
}
export interface CoordinatePoint {
    x: string;
    y: string;
}
export declare function getCoordinateValue(coordinate: Coordinate, start: number, radius: number, angle: number): string;
export declare function numberToCoordinateString(n: number): string;
export declare function getCoordinatePoint(start: number, radius: number, angle: number): CoordinatePoint;
export declare function checkOverlap(a: HTMLElement, b: HTMLElement): boolean;
export declare function formatPercent(value: number, max: number, accurate?: boolean): string;
