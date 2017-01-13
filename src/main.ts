import vdom from 'snabbdom/snabbdom.bundle';
const { h, patch: render } = vdom;


// -------------------- Framework --------------------

type Updater<M, A> = (model: M, action: A) => M;
type Dispatcher<A> = (action: A) => void;
type Renderer<M, A> = (model: M, dispatch: Dispatcher<A>) => any;

function runApp<M, A>(model: M, domNode: HTMLElement,
	update: Updater<M, A>, view: Renderer<M, A>) {
	let vnode = domNode;
	let dispatch = (action: A) => {
		model = update(model, action);
		vnode = render(vnode, view(model, dispatch));
	};
	vnode = render(vnode, view(model, dispatch));
}


// -------------------- Application --------------------

interface ToDoAction {
	type: string;
	text?: string;
	item?: ToDoItem;
}

interface ToDoItem {
	text: string;
	completed: boolean;
}

interface ToDoModel {
	items: ToDoItem[];
	filter: 'All' | 'Pending' | 'Done';
}


function viewAddToDo(model: ToDoModel, dispatch: Dispatcher<ToDoAction>) {
	let toDoText = '';
	return h('div', [
		h('input', {
			on: { input: evt => toDoText = evt.target.value }
		}),
		' ',
		h('button', {
			on: { click: _ => dispatch({ type: 'add', text: toDoText }) }
		}, 'Add')
	]);
}

function viewListItems(model: ToDoModel, dispatch: Dispatcher<ToDoAction>) {
	return h('ul', model.items.map(item =>
		h('li', {
			on: { click: _ => dispatch({ type: 'toggle', item })},
			style: {
				textDecoration: item.completed ? 'line-through' : '',
				cursor: 'pointer'
			}
		}, item.text)
	));
}

function view(model: ToDoModel, dispatch: Dispatcher<ToDoAction>) {
	return h('div', [
		h('h1', 'ToDo'),
		viewAddToDo(model, dispatch),
		viewListItems(model, dispatch)
	]);
}

// ToDo: do not mutate the model
function update(model: ToDoModel, action: ToDoAction): ToDoModel {
	switch (action.type) {
		case 'add':
			model.items.push({ text: action.text || '', completed: false });
			return model;
		case 'toggle':
			if (action.item)
				action.item.completed = !action.item.completed;
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
