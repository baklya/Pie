import React, { CSSProperties, useLayoutEffect, useState } from 'react';
import classNames from 'classnames';

import {
	CENTER_LABELS_ANGLE,
	LABEL_PADDING,
	RADIUS,
} from './constants';
import { ArcLabel } from './arc-label';
import { checkOverlap, getCircleCoordinatePoint } from './utils';

import s from './arc-labels.pcss';

export interface ArcLabelData {
	title: string;
	angle: number;
}

export interface ArcLabelProps {
	data: ArcLabelData[];
}

export function ArcLabels(props: ArcLabelProps): JSX.Element {
	const { data } = props;
	const [overlapped, setOverlapped] = useState(new Set<number>());
	const refs: React.RefObject<HTMLDivElement>[] = [];

	useLayoutEffect(
		() => {
			const newOverlapped = new Set<number>();
			for (let i = 0; i < refs.length && refs.length > 1; i++) {
				const nextIndex = (i + 1) % refs.length;
				const next = refs[nextIndex].current;
				const current = refs[i].current;
				if (!next || !current) {
					continue;
				}
				const overlap = checkOverlap(current, next);
				if (overlap) {
					newOverlapped.add(i);
					newOverlapped.add(nextIndex);
				}
			}
			setOverlapped(newOverlapped);
		},
		[data]
	);

	return (
		<React.Fragment>
			{ data.map((arc: ArcLabelData, index: number) => {
				const { title, angle } = arc;
				const ref = React.createRef<HTMLDivElement>();
				refs.push(ref);
				return (
					<div
						key={ index }
						className={ getLabelClass(angle) }
						style={ getLabelPosStyle(angle, RADIUS + LABEL_PADDING) }
					>
						<ArcLabel
							reference={ ref }
							title={ title }
							overlapped={ overlapped.has(index) }
						/>
					</div>
				);
			}) }
		</React.Fragment>
	);
}

function getLabelClass(angle: number): string {
	const cos = Math.cos(angle);
	const minCos = Math.cos(CENTER_LABELS_ANGLE);
	return classNames(s.labelWrap, Math.abs(cos) >= minCos && (cos > 0 ? s.right : s.left));
}

function getLabelPosStyle(angle: number, labelRadius: number): CSSProperties {
	const point = getCircleCoordinatePoint(RADIUS, RADIUS, labelRadius, labelRadius, angle);
	return {
		top: `${ point.y }%`,
		left: `${ point.x }%`,
	};
}
