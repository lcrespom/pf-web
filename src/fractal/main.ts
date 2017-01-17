import { runComponent, Dispatcher } from '../yocto';
import H from '../tag-helpers';

// -------------------- Componentization framework --------------------
import vdom from 'snabbdom/snabbdom.bundle';
const { h } = vdom;

interface Component<M, A> {
	init: () => M;
	view: (model: M, dispatch: Dispatcher<M, A>) => any;
	update: (model: M, action: A) => M;
}

function plugComponent<M, A>(cmp: Component<M, A>, elm: HTMLElement) {
	let child = document.createElement('div');
	elm.appendChild(child);
	runComponent(cmp.update, cmp.view, cmp.init(), child);
}

function hComponent<M, A>(cmp: Component<M, A>, containerTag: string = 'div') {
	return h(containerTag, {
		hook: {
			create: (e, vnode) => plugComponent(cmp, vnode.elm)
		}
	});
}

// -------------------- Count button component --------------------

interface CountButtonModel {
	count: number;
}

type CountAction = { inc: number };

export type CountDispatcher = Dispatcher<CountButtonModel, CountAction>;

function countButtonView(model: CountButtonModel, dispatch: CountDispatcher) {
	return H.button({
		on: { click: _ => dispatch({ inc: +1 }) }
	}, '' + model.count);
}

function countButtonUpdate(model: CountButtonModel, action: CountAction): CountButtonModel {
	return { count: model.count + action.inc };
}

let countCmp = {
	init: () => ({ count: 0 }),
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
		H.div([
			hComponent(countCmp, 'span'),
			' ',
			hComponent(countCmp, 'span'),
			' ',
			hComponent(countCmp, 'span'),
		]),
		H.p(model.text)
	]);
}

function update(model: FractalModel, action: FractalAction): FractalModel {
	return { text: action.text };
}

document.addEventListener('DOMContentLoaded', _ => {
	let container = document.getElementById('fractal-app');
	if (!container)
		throw Error('No element');
	let model: FractalModel = { text: '' };
	runComponent(update, view, model, container, true);
});



// ToDo render count component inside fractal view etc
// document.addEventListener('DOMContentLoaded', _ => {
// 	let container = document.getElementById('fractal-app');
// 	if (!container)
// 		throw Error('No element found');
// 	plugComponent(countCmp, container);
// });

