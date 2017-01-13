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

document.addEventListener('DOMContentLoaded', _ => {
	let container = document.getElementById('app');
	if (!container)
		throw Error('No "#app" element');
	runApp(null, container, update, view);
});


// -------------------- Application --------------------

function doClick(evt) {
	console.log('click', this, arguments);
}

function view(model) {
	return h('div', [
		h('h1', 'Hello'),
		h('p#pid.cls1.cls2', {
				style: { background: 'yellow' },
				on: { click: [doClick, 1, 2] }
			},
			'Hello from vdom app')
	]);
}

function update(model, action: Action) {
}
