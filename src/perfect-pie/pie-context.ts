import * as React from 'react';

export interface PieContextInterface {
	rotation: number;
	height: number;
	t: number;
}

const defaultPieContext: PieContextInterface = {
	rotation: Math.PI / 2,
	height: 25,
	t: 0,
};

export const PieContext = React.createContext<PieContextInterface>(defaultPieContext);
