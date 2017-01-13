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

interface ToDoItem {
	text: string;
	completed: boolean;
}

interface ToDoModel {
	items: ToDoItem[];
	filter: 'All' | 'Pending' | 'Done';
}


function viewAddToDo(model: ToDoModel, dispatch: Dispatcher) {
	let toDoText = '';
	return h('div', [
		h('input', {
			on: { input: evt => toDoText = evt.target.value }
		}),
		' ',
		h('button', {
			on: { click: _ => dispatch({ type: 'ADD', text: toDoText }) }
		}, 'Add')
	]);
}

function viewListItems(model: ToDoModel, dispatch: Dispatcher) {
	return h('ul', model.items.map(item =>
		h('li', item.text)
	));
}

function view(model: ToDoModel, dispatch: Dispatcher) {
	return h('div', [
		h('h1', 'ToDo'),
		viewAddToDo(model, dispatch),
		viewListItems(model, dispatch)
	]);
}

// ToDo: make Action type generic/inferred
function update(model: ToDoModel, action): ToDoModel {
	switch (action.type) {
		case 'ADD':
			model.items.push({ text: action.text, completed: false });
			return model;
		default: return model;
	}
}

document.addEventListener('DOMContentLoaded', _ => {
	let container = document.getElementById('app');
	if (!container)
		throw Error('No "#app" element');
	let model: ToDoModel = { items: [], filter: 'All' };
	runApp(model, container, update, view);
});
