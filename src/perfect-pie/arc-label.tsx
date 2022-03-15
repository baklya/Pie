import React, { RefObject } from 'react';
import classNames from 'classnames';

import s from './arc-label.pcss';

export interface ArcLabelProps {
	reference?: RefObject<HTMLDivElement>;
	title: string;
	overlapped: boolean;
}

export function ArcLabel(props: ArcLabelProps): JSX.Element {
	const { reference, title, overlapped } = props;
	return (
		<div className={ classNames(s.container, overlapped && s.overlapped) }>
			<div ref={ reference }>{ title }</div>
		</div>
	);
}
