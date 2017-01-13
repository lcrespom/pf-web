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
	input: string;
	items: ToDoItem[];
	filter: 'All' | 'Pending' | 'Done';
}

type ToDoDispatcher = Dispatcher<ToDoAction>;


function viewAddToDo(model: ToDoModel, dispatch: ToDoDispatcher) {
	return h('div', [
		h('input', {
			on: { input: evt => dispatch({ type: 'input', text: evt.target.value }) },
			props: { value: model.input }
		}),
		' ',
		h('button', {
			on: { click: _ => dispatch({ type: 'add', text: model.input }) }
		}, 'Add')
	]);
}

function viewListItems(items: ToDoItem[], dispatch: ToDoDispatcher) {
	return h('ul', items.map(item =>
		h('li', {
			on: { click: _ => dispatch({ type: 'toggle', item })},
			style: {
				textDecoration: item.completed ? 'line-through' : '',
				cursor: 'pointer'
			}
		}, item.text)
	));
}

function view(model: ToDoModel, dispatch: ToDoDispatcher) {
	return h('div', [
		h('h1', 'ToDo'),
		viewAddToDo(model, dispatch),
		viewListItems(model.items, dispatch)
	]);
}

// ToDo: do not mutate the model
function update(model: ToDoModel, action: ToDoAction): ToDoModel {
	switch (action.type) {
		case 'input':
			model.input = action.text || '';
			return model;
		case 'add':
			model.items.push({ text: action.text || '', completed: false });
			model.input = '';
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
	let model: ToDoModel = { input: '', items: [], filter: 'All' };
	runApp(model, container, update, view);
});
