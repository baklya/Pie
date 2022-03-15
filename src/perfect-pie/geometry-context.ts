import * as React from 'react';

export interface GeometryContextInterface {
	radius: number;
	projectionWidth: number;
}

const defaultGeometryContext: GeometryContextInterface = {
	radius: 0,
	projectionWidth: 0,
};

export const GeometryContext = React.createContext<GeometryContextInterface>(defaultGeometryContext);
