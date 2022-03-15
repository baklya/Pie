import React, { useState } from 'react';

import { PieContext } from '../perfect-pie/pie-context';
import { PerfectPie } from '../perfect-pie';

const data = [
	{ name: 'AAPL', count: 150 },
	{ name: 'GOOG', count: 100 },
	{ name: 'MSFT', count: 100 },
];
const data2 = [
	{ name: 'AAPL', count: 11.11 },

];

export function Main(): JSX.Element {

	const [height, setHeight] = useState(15);
	const [rotation, setRotation] = useState(Math.PI / 2);
	const [t, setT] = useState(0);

	return (

		<React.Fragment>

			<div style={ { position: 'fixed', zIndex: 10 } }>
				<input type="number" style={ { position: 'absolute' } } value={ height } onChange={ handleHeightChange }/>
				<input type="number" step={ 0.05 } style={ { position: 'absolute', top: 30 } } value={ rotation } onChange={ handleRotationChange }/>
				<input type="number" step={ 0.01 } max={ 2 } min={ 0 } style={ { position: 'absolute', top: 60 } } value={ t } onChange={ handleTChange }/>
			</div>
			<div style={ { width: 1000, height: 1000, padding: 300 } }>

				<PieContext.Provider value={{ height, rotation, t }}>
					<PerfectPie
						title="Stocks"
						data={ data }
						selectable
					/>
				</PieContext.Provider>

			</div>

			<div style={ { width: 1000, height: 1000, padding: 100 } }>
				<PerfectPie
					title="Stocks"
					data={ data2 }
					selectable
				/>
			</div>
		</React.Fragment>

	);

	function handleHeightChange(e: React.ChangeEvent<HTMLInputElement>): void {
		setHeight(parseFloat(e.target.value) || 0);
	}

	function handleRotationChange(e: React.ChangeEvent<HTMLInputElement>): void {
		setRotation(parseFloat(e.target.value));
	}

	function handleTChange(e: React.ChangeEvent<HTMLInputElement>): void {
		setT(parseFloat(e.target.value));
	}

}
