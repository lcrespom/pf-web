import vdom from 'snabbdom/snabbdom.bundle';
import H from './tag-helpers';
const render = vdom.patch;
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
	filter?: string;
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
	return H.div([
		H.input({
			on: { input: evt => dispatch({ type: 'input', text: evt.target.value }) },
			props: { value: model.input }
		}),
		' ',
		H.button({
			on: { click: _ => dispatch({ type: 'add', text: model.input }) }
		}, 'Add')
	]);
}

function viewListItems(items: ToDoItem[], dispatch: ToDoDispatcher) {
	return H.ul(items.map(item =>
		H.li({
			on: { click: _ => dispatch({ type: 'toggle', item }) },
			style: {
				textDecoration: item.completed ? 'line-through' : '',
				cursor: 'pointer'
			}
		}, item.text)
	));
}

function viewFilter(filter, dispatch) {

	function link(txt, active) {
		if (!active) return txt;
		return H.a({
			attrs: { href: '#' + txt },
			on: { click: _ => dispatch({ type: 'filter', filter: txt }) }
		}, txt);
	}

	return H.p([
		H.b('Filter: '),
		link('All', filter != 'All'),
		' | ',
		link('Pending', filter != 'Pending'),
		' | ',
		link('Done', filter != 'Done')
	]);
}

function filterItems(items, filter) {
	switch (filter) {
		case 'All':
			return items;
		case 'Pending':
			return items.filter(i => !i.completed);
		case 'Done':
			return items.filter(i => i.completed);
	}
}

function view(model: ToDoModel, dispatch: ToDoDispatcher) {
	return H.div([
		H.h1('ToDo'),
		viewAddToDo(model, dispatch),
		viewListItems(filterItems(model.items, model.filter), dispatch),
		viewFilter(model.filter, dispatch)
	]);
}

function update(model: ToDoModel, action: ToDoAction): ToDoModel {
	let newItem;
	let newModel = R.merge(model);
	let replaceInList = (list, oldElem, newElem) =>
		list.map(item => item === oldElem ? newElem : item);
	switch (action.type) {
		case 'input':
			return newModel({
				input: action.text
			});
		case 'add':
			newItem = { text: action.text || '', completed: false };
			return newModel({
				input: '',
				items: model.items.concat(newItem)
			});
		case 'toggle':
			let completed = action.item ? !action.item.completed : true;
			newItem = R.merge(action.item, { completed });
			return newModel({
				items: replaceInList(model.items, action.item, newItem)
			});
		case 'filter':
			return newModel({ filter: action.filter });
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
