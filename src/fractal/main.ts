import { runComponent, Dispatcher, ParentDispatch, hComponent } from '../yocto';
import H from '../tag-helpers';
declare const R;


// -------------------- Count button component --------------------

interface CountButtonModel {
	count: number;
	eventEvery: number;
}

type CountAction = { inc: number };

export type CountDispatcher = Dispatcher<CountButtonModel, CountAction>;

function countButtonView(model: CountButtonModel, dispatch: CountDispatcher) {
	return H.button({
		on: { click: _ => dispatch({ inc: +1 }) }
	}, '' + model.count);
}

function countButtonUpdate(model: CountButtonModel, action: CountAction,
	parentDispatch?: ParentDispatch): CountButtonModel {
	let newCount = model.count + action.inc;
	if (parentDispatch && newCount % model.eventEvery == 0)
		parentDispatch(newCount);
	return R.merge(model, { count: newCount });
}

let countCmp = {
	init: () => ({ count: 0, eventEvery: 5 }),
	view: countButtonView,
	update: countButtonUpdate
};

// -------------------- Main app --------------------

interface FractalModel {
	text: string;
}

type FractalAction = { text: string };

export type FractalDispatcher = Dispatcher<FractalModel, FractalAction>;

function view(model: FractalModel, dispatch: FractalDispatcher) {
	return H.div([
		H.h1('Fractal'),
		H.input({
			on: { change: evt => dispatch({ text: evt.target.value }) },
		}),
		H.br(), H.br(),
		H.div([
			hComponent(countCmp, {
				tag: 'span',
				parentDispatch: num => dispatch({ text: '' + num })}),
			' ',
			hComponent(countCmp, { tag: 'span'}),
			' ',
			hComponent(countCmp, { tag: 'span'})
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
