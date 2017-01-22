import H from '../../tag-helpers';
import { ToDoItem, ToDoModel, ToDoDispatcher } from './types';


function viewAddToDo(model: ToDoModel, dispatch: ToDoDispatcher) {
	return H.div([
		H.input({
			on: { change: evt => dispatch({ type: 'input', text: evt.target.value }) },
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

export function view(model: ToDoModel, dispatch: ToDoDispatcher) {
	return H.div([
		H.h1('ToDo'),
		viewAddToDo(model, dispatch),
		viewListItems(filterItems(model.items, model.filter), dispatch),
		viewFilter(model.filter, dispatch)
	]);
}
