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
	runComponent(cmp.update, cmp.view, cmp.init(), elm);
}

function hComponent<M, A>(cmp: Component<M, A>) {
	return h('div', {
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
	return H.div();
}

function update(model: FractalModel, action: FractalAction): FractalModel {
	return { text: action.text };
}


// ToDo render count component inside fractal view etc
document.addEventListener('DOMContentLoaded', _ => {
	let container = document.getElementById('fractal-app');
	if (!container)
		throw Error('No element found');
	plugComponent(countCmp, container);
});

