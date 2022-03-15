import {
	MIN_COORDINATE_VALUE,
	MIN_VISIBLE_PERCENTS_VALUE,
	OVERLAP_DELTA,
} from './constants';

export const enum Coordinate {
	X,
	Y,
}

export interface CoordinatePoint {
	x: number;
	y: number;
}

const fractionDigits = Math.abs(Math.log10(MIN_COORDINATE_VALUE));

export function getCircleCoordinateValue(coordinate: Coordinate, start: number, val: number, angle: number): number {
	const f = coordinate === Coordinate.X ? Math.cos : Math.sin;
	return start + val * f(angle);
}

export function numberToCoordinateString(n: number): string {
	return n.toFixed(fractionDigits);
}

export function getCircleCoordinatePoint(x: number, y: number, a: number, b: number, angle: number): CoordinatePoint {
	return {
		x: getCircleCoordinateValue(Coordinate.X, x, a, angle),
		y: getCircleCoordinateValue(Coordinate.Y, y, b, angle),
	};
}

export function checkOverlap(a: HTMLElement, b: HTMLElement): boolean {
	const { x: x1, y: y1, width: w1, height: h1 } = a.getBoundingClientRect();
	const { x: x2, y: y2, width: w2, height: h2 } = b.getBoundingClientRect();
	return !(x1 - x2 >= w2 - OVERLAP_DELTA ||
		x2 - x1 >= w1 - OVERLAP_DELTA ||
		y1 - y2 >= h2 - OVERLAP_DELTA ||
		y2 - y1 >= h1 - OVERLAP_DELTA);
}

export function formatPercent(value: number, max: number, accurate?: boolean): string {
	const percents = value / max * 100;
	if (accurate) {
		return `${ Math.round(percents * 100) / 100 }%`;
	}
	return percents > MIN_VISIBLE_PERCENTS_VALUE ? `${ Math.round(percents) }%` : '';
}

// todo возможность кастомной палитры
export const SERIES_COLORS = [
	'#2196F3',
	'#00BFA5',
	'#FF9800',
	'#26c6da',
	'#fbc02d',
	'#673ab7',
	'aliceblue',
	'antiquewhite',
	'aqua',
	'aquamarine',
	'azure',
	'beige',
	'bisque',
	'black',
	'blanchedalmond',
	'blue',
	'blueviolet',
	'brown',
	'burlywood',
	'cadetblue',
	'chartreuse',
	'chocolate',
	'coral',
	'cornflowerblue',
	'cornsilk',
	'crimson',
	'cyan',
	'darkblue',
	'darkcyan',
	'darkgoldenrod',
	'darkgray',
	'darkgrey',
	'darkgreen',
	'darkkhaki',
	'darkmagenta',
	'darkolivegreen',
	'darkorange',
	'darkorchid',
	'darkred',
	'darksalmon',
	'darkseagreen',
	'darkslateblue',
	'darkslategray',
	'darkslategrey',
	'darkturquoise',
	'darkviolet',
	'deeppink',
	'deepskyblue',
	'dimgray',
	'dimgrey',
	'dodgerblue',
	'firebrick',
	'floralwhite',
	'forestgreen',
	'fuchsia',
	'gainsboro',
	'ghostwhite',
	'gold',
	'goldenrod',
	'gray',
	'grey',
	'green',
	'greenyellow',
	'honeydew',
	'hotpink',
	'indianred',
	'indigo',
	'ivory',
	'khaki',
	'lavender',
	'lavenderblush',
	'lawngreen',
	'lemonchiffon',
	'lightblue',
	'lightcoral',
	'lightcyan',
	'lightgoldenrodyellow',
	'lightgreen',
	'lightgray',
	'lightgrey',
	'lightpink',
	'lightsalmon',
	'lightseagreen',
	'lightskyblue',
	'lightslategray',
	'lightslategrey',
	'lightsteelblue',
	'lightyellow',
	'lime',
	'limegreen',
	'linen',
	'magenta',
	'maroon',
	'mediumaquamarine',
	'mediumblue',
	'mediumorchid',
	'mediumpurple',
	'mediumseagreen',
	'mediumslateblue',
	'mediumspringgreen',
	'mediumturquoise',
	'mediumvioletred',
	'midnightblue',
	'mintcream',
	'mistyrose',
	'moccasin',
	'navajowhite',
	'navy',
	'oldlace',
	'olive',
	'olivedrab',
	'orange',
	'orangered',
	'orchid',
	'palegoldenrod',
	'palegreen',
	'paleturquoise',
	'palevioletred',
	'papayawhip',
	'peachpuff',
	'peru',
	'pink',
	'plum',
	'powderblue',
	'purple',
	'rebeccapurple',
	'red',
	'rosybrown',
	'royalblue',
	'saddlebrown',
	'salmon',
	'sandybrown',
	'seagreen',
	'seashell',
	'sienna',
	'silver',
	'skyblue',
	'slateblue',
	'slategray',
	'slategrey',
	'snow',
	'springgreen',
	'steelblue',
	'tan',
	'teal',
	'thistle',
	'tomato',
	'turquoise',
	'violet',
	'wheat',
	//'white',
	'whitesmoke',
	'yellow',
	'yellowgreen',
];

export function getColorByIndex(index: number): string {
	const color = SERIES_COLORS[index % SERIES_COLORS.length];
	return color ? color : SERIES_COLORS[0];
}
