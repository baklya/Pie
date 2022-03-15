import React, { useContext, useState } from 'react';

import { Point } from './interfaces';

import {
	LABEL_PADDING, MIN_COORDINATE_VALUE,

	SELECTED_ARC_OFFSET,
	SELECTED_ARC_WIDTH,
} from './constants';
import {
	CoordinatePoint,
	formatPercent,
	getCircleCoordinatePoint,
} from './utils';

import { PieContext } from './pie-context';

import { GeometryContext } from './geometry-context';

import s from './arc.pcss';

export interface ArcProps {
	id: number;
	startAngle: number;
	endAngle: number;
	color?: string;
	onClick: (id: number) => void;
	selectable?: boolean;
}

export function Arc(props: ArcProps): JSX.Element {
	const { id, startAngle, endAngle, color, onClick, selectable } = props;
	const [selected, setSelected] = useState(false);

	const { height, rotation } = useContext(PieContext);
	const { radius, projectionWidth } = useContext(GeometryContext);

	const value = Math.abs(endAngle - startAngle);

	const labelPoint = getMiddlePoint(radius, radius - LABEL_PADDING, startAngle, endAngle);

	const {
		startLeaf,
		endLeaf,
		midArc,
		sector,
	} = getArcBezierPath(radius, radius, startAngle, endAngle, rotation, height, projectionWidth);

	return (
		<g
			className={ s.wrap }
			onClick={ handleClick }
			fill={ color }
		>

			<path d={ startLeaf } stroke={ 'black' } strokeWidth={ 0.05 } fill={ color }/>
			<path d={ endLeaf } stroke={ 'black' } strokeWidth={ 0.05 } fill={ color }/>

			<path d={ sector } stroke={ 'black' } strokeWidth={ 0.05 } fill={ color }/>
			<path d={ midArc } stroke={ 'black' } strokeWidth={ 0.05 } fillOpacity={ 1 } fill={ 'transparent' }/>

			{ selectable && selected && <path
				className={ s.selected }
				d={ getArcPathD(radius, radius + SELECTED_ARC_OFFSET, startAngle, endAngle) }
				stroke={ color }
				strokeWidth={ SELECTED_ARC_WIDTH }
				fill="none"
			/> }
			<text
				className={ s.label }
				x={ labelPoint.x }
				y={ labelPoint.y }
				dominantBaseline="middle"
			>
				{ formatPercent(value, 2 * Math.PI) }
			</text>
		</g>
	);

	function handleClick(): void {
		onClick(id);
		if (!selectable) {
			return;
		}
		setSelected(!selected);
	}
}

function getMiddlePoint(start: number, radius: number, startAngle: number, endAngle: number): CoordinatePoint {
	const middle = (startAngle + endAngle) / 2;
	return getCircleCoordinatePoint(start, start, radius, radius, middle);
}

function getArcPathD(start: number, radius: number, startAngle: number, endAngle: number): string {
	return `M${ getArcCurve(start, radius, startAngle, endAngle) }`;
}

export interface ArcDetails {
	startLeaf: string;
	endLeaf: string;
	midArc: string;
	sector: string;
}

function getArcBezierPath(start: number, radius: number, startAngle: number, endAngle: number, rotation: number, height: number, projectionWidth: number): ArcDetails {

	const getLeaf = (angle: number) => {

		const endPoint = getCircleCoordinatePoint(start, start, radius, radius, angle);

		const h = start - start * Math.sin(rotation); // новая высота

		// угол 90

		const someCoolValue2 = 4 * Math.tan(Math.PI / 8) / 3 * radius;
		const someCoolValue3 = 4 * Math.tan(Math.PI / 8) / 3 * height;

		const currentPoint = getCircleCoordinatePoint(start, start, someCoolValue2, someCoolValue2, angle);

		return `M${ start } ${ start - height } C ${ currentPoint.x } ${ currentPoint.y * Math.sin(rotation) + h - height }, ${ endPoint.x } ${ endPoint.y * Math.sin(rotation) + h - someCoolValue3 }, ${ endPoint.x } ${ endPoint.y * Math.sin(rotation) + h } C ${ endPoint.x } ${ endPoint.y * Math.sin(rotation) + h + someCoolValue3 }, ${ currentPoint.x } ${ currentPoint.y * Math.sin(rotation) + h + height }, ${ start } ${ start + height }`;
	};



	const endLeaf = getLeaf(endAngle);
	const startLeaf = getLeaf(startAngle);


	//const projectionTopArc = `M0 ${ start } A ${ radius } ${ projectionWidth } 0 0 1 ${ start * 2 } ${ start }`;
	//const projectionBottomArc = `M${ start * 2 } ${ start } A 50 ${ projectionWidth } 0 0 1 0 ${ start }`;

	const mid = moveCoordinates(
		getEllipseSector(radius, Math.abs(radius * Math.sin(rotation)), startAngle, endAngle, Math.sin(rotation) < 0),
		start,
		start
	);
	const midArc = `M${ mid[0].x } ${ mid[0].y } C ${ mid[1].x } ${ mid[1].y }, ${ mid[2].x } ${ mid[2].y }, ${ mid[3].x } ${ mid[3].y } L${ start } ${ start }z`;

	// todo у нас есть все точки, надо получить из них дуги, немного сложно будет с внешней частью дуги, у нее надо будет получить угол и взять тангенс от него по примеру

	// todo функция, которая по двум углам вернет дугу между ними на эллипсе

	const getEdgePoints = (angle: number) => {
		const k = getTangentCoefficient(radius, radius * Math.sin(rotation), angle);
		const [xxx, yyy] = getPosOnEllipseWithTangentCoefficient(radius, projectionWidth, k);
		const dir = Math.sign(Math.sin(angle) * Math.sin(rotation));

		return {
			x: - xxx * dir,
			y: - yyy * (-dir),
		};
	};

	const { x: startX } = getEdgePoints(startAngle);
	const { x: endX } = getEdgePoints(endAngle);

	const newStart = Math.acos(startX / radius) * Math.sign(Math.sin(startAngle));
	const newEnd = Math.acos(endX / radius) * Math.sign(Math.sin(endAngle));

	// по сути надо сделать возможность свапать по игрику

	const sectorCoordinates = moveCoordinates(
		getEllipseSector(radius, projectionWidth, newStart, newEnd, Math.sin(rotation) < 0),
		start,
		start
	);

	// todo точность

	const sector = `M${ sectorCoordinates[0].x } ${ sectorCoordinates[0].y } C ${ sectorCoordinates[1].x } ${ sectorCoordinates[1].y }, ${ sectorCoordinates[2].x } ${ sectorCoordinates[2].y }, ${ sectorCoordinates[3].x } ${ sectorCoordinates[3].y } L${ start } ${ start }z`;

	return {
		startLeaf: startLeaf,
		endLeaf: endLeaf,
		//projectionTopArc,
		//projectionBottomArc,
		midArc,
		sector,
	};
}

function moveCoordinates(coordinates: Point[], deltaX: number, deltaY: number): Point[] {
	return coordinates.map((coordinate: Point) => ({ x: coordinate.x + deltaX, y: coordinate.y + deltaY }));
}

function normalizeAngle(angle: number): number {
	const twoPI = 2 * Math.PI;
	return (twoPI + angle % twoPI) % twoPI;
}

function getEllipseSector(a: number, b: number, startAngle: number, endAngle: number, swapY: boolean = false): [Point, Point, Point, Point] {
	const x1 = a * Math.cos(startAngle);
	const y1 = b * Math.sin(startAngle);

	const x2 = a * Math.cos(endAngle);
	const y2 = b * Math.sin(endAngle);

	// если крутим от плюса к минусу, то надо последнее значение нормализировать
	const delta = (endAngle < 0 && startAngle > 0 ? normalizeAngle(endAngle) : endAngle) - startAngle;

	const someCoolValueA = Math.abs(4 * Math.tan(delta / 4) / 3 * a);
	const someCoolValueB = Math.abs(4 * Math.tan(delta / 4) / 3 * b);

	const p1 = {
		x: x1 + Math.cos(startAngle + Math.PI / 2) * someCoolValueA,
		y: y1 + Math.sin(startAngle + Math.PI / 2) * someCoolValueB,
	};

	const p2 = {
		x: x2 + Math.cos(endAngle - Math.PI / 2) * someCoolValueA,
		y: y2 + Math.sin(endAngle - Math.PI / 2) * someCoolValueB,
	};

	if (swapY) {
		return [
			{ x: x2, y: -y2 },
			{ x: p2.x, y: -p2.y },
			{ x: p1.x, y: -p1.y },
			{ x: x1, y: -y1 },
		];
	}

	return [
		{ x: x1, y: y1 },
		p1,
		p2,
		{ x: x2, y: y2 },
	];
}

function getTangentCoefficient(a: number, b: number, angle: number): number {
	const x1 = a * Math.cos(angle);
	const y1 = b * Math.sin(angle);

	return (-x1 * y1 + Math.sqrt(Math.abs(b ** 2 * x1 ** 2 + a ** 2 * y1 ** 2 - a ** 2 * b ** 2))) / (a ** 2 - x1 ** 2);
}

function getPosOnEllipseWithTangentCoefficient(a: number, b: number, k: number): [number, number] {
	const x = k * a ** 2 / Math.sqrt(k ** 2 * a ** 2 + b ** 2);
	const y = b ** 2 / Math.sqrt(k ** 2 * a ** 2 + b ** 2);
	return [x, y];
}

function getArcCurve(start: number, radius: number, startAngle: number, endAngle: number, clockwise: boolean = true): string {
	return getArcCurveXY(start, start, radius, radius, startAngle, endAngle, clockwise);
}

function getArcCurveXY(x: number, y: number, a: number, b: number, startAngle: number, endAngle: number, clockwise: boolean = true): string {
	const startPoint = getCircleCoordinatePoint(x, y, a, b, startAngle);
	const endPoint = getCircleCoordinatePoint(x, y, a, b, endAngle);
	if (startPoint.x === endPoint.x && startPoint.y === endPoint.y) {
		(clockwise ? startPoint : endPoint).x = x + MIN_COORDINATE_VALUE;
	}
	const sizeFlag = Math.abs(startAngle - endAngle) > Math.PI ? 1 : 0;
	const clockwiseFlag = clockwise ? 1 : 0;

	return `${ startPoint.x },${ startPoint.y }A${ a },${ b } 0,${ sizeFlag },${ clockwiseFlag } ${ endPoint.x },${ endPoint.y }`;
}
