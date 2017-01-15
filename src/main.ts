import { runComponent, Dispatcher } from './yocto';
import H from './tag-helpers';
declare var R;


type ToDoAction = InputAction | AddAction | ToggleAction | FilterAction;

interface InputAction {
	type: 'input';
	text: string;
}

interface AddAction {
	type: 'add';
	text: string;
}

interface ToggleAction {
	type: 'toggle';
	item: ToDoItem;
}

interface FilterAction {
	type: 'filter';
	filter: string;
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

type ToDoDispatcher = Dispatcher<ToDoModel, ToDoAction>;


function viewAddToDo(model: ToDoModel, dispatch: ToDoDispatcher) {
	return H.div([
		H.input({
			on: { input: evt => dispatch({ type: 'input', text: evt.target.value }) },
			props: { value: model.input },
			attrs: { autofocus: true }
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
			newItem = { text: action.text, completed: false };
			return newModel({
				input: '',
				items: model.items.concat(newItem)
			});
		case 'toggle':
			let completed = !action.item.completed;
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
	runComponent(update, view, model, container, true);
});
