import { MIN_COORDINATE_VALUE, MIN_VISIBLE_PERCENTS_VALUE, OVERLAP_DELTA, } from './constants';
var fractionDigits = Math.abs(Math.log10(MIN_COORDINATE_VALUE));
export function getCoordinateValue(coordinate, start, radius, angle) {
    var f = coordinate === 0 /* X */ ? Math.cos : Math.sin;
    return numberToCoordinateString(start + radius * f(angle));
}
export function numberToCoordinateString(n) {
    return n.toFixed(fractionDigits);
}
export function getCoordinatePoint(start, radius, angle) {
    return {
        x: getCoordinateValue(0 /* X */, start, radius, angle),
        y: getCoordinateValue(1 /* Y */, start, radius, angle),
    };
}
export function checkOverlap(a, b) {
    var _a = a.getBoundingClientRect(), x1 = _a.x, y1 = _a.y, w1 = _a.width, h1 = _a.height;
    var _b = b.getBoundingClientRect(), x2 = _b.x, y2 = _b.y, w2 = _b.width, h2 = _b.height;
    return !(x1 - x2 >= w2 - OVERLAP_DELTA ||
        x2 - x1 >= w1 - OVERLAP_DELTA ||
        y1 - y2 >= h2 - OVERLAP_DELTA ||
        y2 - y1 >= h1 - OVERLAP_DELTA);
}
export function formatPercent(value, max, accurate) {
    var percents = value / max * 100;
    if (accurate) {
        return Math.round(percents * 100) / 100 + "%";
    }
    return percents > MIN_VISIBLE_PERCENTS_VALUE ? Math.round(percents) + "%" : '';
}
