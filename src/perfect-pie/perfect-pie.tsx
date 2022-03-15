import React, { useContext, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';

import {
	ARC_WIDTH,
	DIAMETER, ELLIPSE_SCALE, RADIUS,
	START_ANGLE,
} from './constants';
import { GeometryContext } from './geometry-context';

import { BoundBox } from './bound-box';

import { Arc } from './arc';
import { ArcLabelData, ArcLabels } from './arc-labels';
import { getColorByIndex } from './utils';

import { PieContext } from './pie-context';

import s from './perfect-pie.pcss';

export interface SectorData {
	name: string;
	count: number;
}

export interface PieProps {
	data: SectorData[];
	title?: string;
	selectable?: boolean;
}

export interface ArcData {
	start: number;
	end: number;
	color: string;
}

const centerTextSize = `${ DIAMETER - ARC_WIDTH }%`;
const centerTextSizeStyle = { height: centerTextSize, width: centerTextSize, transform: `scale(1, ${ 1 / ELLIPSE_SCALE })` };

// todo математический контекст

export function PerfectPie(props: PieProps): JSX.Element {
	const { title, data, selectable } = props;

	const { height, rotation } = useContext(PieContext);

	const [selected, setSelected] = useState(new Set<number>());
	const svgRef = useRef<SVGSVGElement | null>(null);

	data.sort((a: SectorData, b: SectorData) => {
		return b.count - a.count;
	});

	const labels = useMemo(() => data.map((d: SectorData) => d.name), [data]);
	const values = useMemo(() => data.map((d: SectorData) => d.count), [data]);
	const sum = useMemo(() => values.reduce((a: number, b: number) => a + b, 0), [values]);

	// todo еще порядок зависит от стартового угла
	const arcsData = useMemo(
		() => {
			const res: ArcData[] = [];
			let currentAngle = START_ANGLE;
			for (let i = 0; i < values.length; i++) {
				const nextAngle = currentAngle + 2 * Math.PI * values[i] / sum;
				res.push({
					start: currentAngle,
					end: nextAngle,
					color: getColorByIndex(i),
				});
				currentAngle = nextAngle;
			}

			const point = Math.PI / 2;

			const r1: ArcData[] = [];
			const r2: ArcData[] = [];

			let flg = false;
			res.forEach((el: ArcData) => {
				if (flg) {
					r2.push(el);
					return;
				} else {
					r1.push(el);
				}
				if (el.start < point && el.end > point) {
					flg = true;
				}
			});

			return [...r2.reverse(), ...r1];

		},
		[values]
	);

	const labelsData = useMemo(
		() => {
			const res: ArcLabelData[] = [];
			let currentAngle = START_ANGLE;
			for (let i = 0; i < values.length; i++) {
				const nextAngle = currentAngle + 2 * Math.PI * values[i] / sum;
				res.push({
					title: labels[i],
					angle: (currentAngle + nextAngle) / 2,
				});
				currentAngle = nextAngle;
			}
			return res;
		},
		[values]
	);

	const count = labels.length;

	const isValid = useMemo(() => values.every((v: number) => v >= 0) && sum > 0, [values]);
	const arcElements = useMemo(
		() => arcsData.map((arc: ArcData, index: number) => (
			<Arc
				key={ index }
				id={ index }
				startAngle={ arc.start }
				endAngle={ arc.end }
				color={ arc.color }
				onClick={ handleArcClick }
				selectable={ selectable }
			/>
		)),
		[arcsData]
	);

	const arcLabelElements = useMemo(
		() => <ArcLabels data={ labelsData }/>,
		[labelsData]
	);

	if (!isValid) {
		return (
			<div className={ classNames(s.pieContainer, s.invalid) }>
				<div className={ s.centerText } style={ centerTextSizeStyle }>
					<div>INVALID DATA</div>
				</div>
			</div>
		);
	}

	const projectionWidth = getProjectionWidth();

	return (
		<div className={ s.pieContainer }>
			<div className={ s.centerText } style={ centerTextSizeStyle }>
				<div>{ count }</div>
				<div>{ title }</div>
			</div>
			<svg
				ref={ svgRef }
				xmlns="http://www.w3.org/2000/svg"
				className={ s.chart }
				width={ DIAMETER }
				height={ DIAMETER }
				viewBox={ `0 0 ${ DIAMETER } ${ DIAMETER }` }
				strokeWidth="0"
				onMouseMove={ handlePieMousePosition }
				onMouseOut={ handlePieMouseOut }
			>
				<GeometryContext.Provider value={ { projectionWidth, radius: RADIUS } }>
					<BoundBox />
					{ arcElements }
				</GeometryContext.Provider>
			</svg>
			{ arcLabelElements }
		</div>
	);

	function getProjectionWidth(): number {
		const r = RADIUS * Math.sin(rotation);
		return Math.sqrt(r ** 2 + height ** 2);
	}

	function handleArcClick(id: number): void {
		if (!selectable) {
			return;
		}
		const newSelected = new Set(selected);
		if (newSelected.has(id)) {
			newSelected.delete(id);
		} else {
			newSelected.add(id);
		}
		setSelected(newSelected);
	}

	function handlePieMousePosition(e: React.MouseEvent<SVGSVGElement>): void {

		// todo возможность навесить любую логику на ховер

		/*const arcTooltip = arcTooltipRef.current;
		if (!arcTooltip) {
			return;
		}

		const dataId = (e.target as Element).getAttribute('data-id');
		if (dataId !== null) {
			const { clientX: x, clientY: y } = e;
			const hoveredId = parseInt(dataId);
			arcTooltip.updateData({
				x,
				y,
				isLeft: isLeftTooltip(x),
				text: labels[hoveredId],
				count: values[hoveredId],
				percents: formatPercent(values[hoveredId], sum, true),
				color: 'blue', // getColorByIndex(hoveredId),
			});
		} else {
			arcTooltip.updateData(null);
		}*/
	}

	function handlePieMouseOut(e: React.MouseEvent<SVGSVGElement>): void {
		// arcTooltipRef.current?.updateData(null);
	}
}
