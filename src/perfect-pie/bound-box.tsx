import React, { useContext } from 'react';

import { GeometryContext } from './geometry-context';

export function BoundBox(): JSX.Element {
	const { radius } = useContext(GeometryContext);
	const boundBoxD = getBoundBoxPath(radius, radius);

	return (
		<path d={ boundBoxD }  fill={ 'none' } strokeWidth={ 0.2 } stroke={'black'}/>
	);
}

function getSquarePath(start: number, radius: number): string {
	const positive = start + radius;
	const negative = start - radius;

	return `${ positive },${ positive }L${ positive },${ negative }L${ negative },${ negative }L${ negative },${ positive }`;
}

function getBoundBoxPath(start: number, radius: number): string {
	return `M${ getSquarePath(start, radius) }z`;
}
