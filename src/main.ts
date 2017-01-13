import vdom from 'snabbdom/snabbdom.bundle';
const { h, patch: render } = vdom;
declare var R;


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

function update(model: ToDoModel, action: ToDoAction): ToDoModel {
	let newModel = R.merge(model);
	switch (action.type) {
		case 'input':
			return newModel({ input: action.text });
		case 'add':
			let newItem = { text: action.text || '', completed: false };
			return newModel({
				input: '',
				items: model.items.concat(newItem)
			});
		case 'toggle':
			return newModel({
				items: model.items.map(item =>
					item == action.item ?
					R.merge(item, { completed: !item.completed })
					: item)
			});
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
