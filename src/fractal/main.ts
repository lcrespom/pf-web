import { runComponent, Dispatcher } from '../yocto';
import H from '../tag-helpers';
import { CountButtonComponent } from './count-button';


// -------------------- Main app --------------------

interface FractalModel {
	text: string;
}

type FractalAction = { text: string };

export type FractalDispatcher = Dispatcher<FractalModel, FractalAction>;

function view(model: FractalModel, dispatch: FractalDispatcher) {
	const onEvent = num => dispatch({ text: '' + num });
	return H.div([
		H.h1('Fractal'),
		H.input({
			on: { change: evt => dispatch({ text: evt.target.value }) },
		}),
		H.br(), H.br(),
		H.div([
			CountButtonComponent({ tag: 'span', onEvent }),
			' ',
			CountButtonComponent({ tag: 'span',
				props: { eventEvery: 2 }, onEvent }),
			' ',
			CountButtonComponent({ tag: 'span', debug: 'count3' })
		]),
		H.p(model.text)
	]);
}

function update(model: FractalModel, action: FractalAction): FractalModel {
	return { text: action.text };
}

function initModel(): FractalModel {
	return { text: '' };
}

document.addEventListener('DOMContentLoaded', _ => {
	let container = document.getElementById('fractal-app');
	if (!container)
		throw Error('No element');
	let fractalComponent = { view, update, init: initModel };
	runComponent(fractalComponent, container);
});
