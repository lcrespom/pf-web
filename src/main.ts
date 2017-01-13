import vdom from 'snabbdom/snabbdom.bundle';
const { h, patch: render } = vdom;


// -------------------- Framework --------------------

interface Action {
	type: string;
	[others: string]: any;
}

type Updater<M> = (model: M, action: Action) => M;
type Dispatcher = (action: Action) => void;
type Renderer<M> = (model: M, dispatch: Dispatcher) => any;

function runApp<M>(model: M, domNode: HTMLElement, update: Updater<M>, view: Renderer<M>) {
	let vnode = domNode;
	let dispatch = (action: Action) => {
		model = update(model, action);
		vnode = render(vnode, view(model, dispatch));
	};
	vnode = render(vnode, view(model, dispatch));
}


// -------------------- Application --------------------

function view(model: number, dispatch: Dispatcher) {
	return h('div', [
		h('h1', 'Counter'),
		h('button', {
				on: { click: _ => dispatch({ type: 'DECREMENT' }) }
			},
			' - '
		),
		h('span', ' ' + model + ' '),
		h('button', {
				on: { click: _ => dispatch({ type: 'INCREMENT' }) }
			},
			' + '
		)
	]);
}

function update(model: number, action: Action): number {
	switch (action.type) {
		case 'INCREMENT': return model + 1;
		case 'DECREMENT': return model - 1;
	}
	return model;
}

document.addEventListener('DOMContentLoaded', _ => {
	let container = document.getElementById('app');
	if (!container)
		throw Error('No "#app" element');
	runApp(0, container, update, view);
});
