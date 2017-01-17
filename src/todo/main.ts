import { runComponent } from '../yocto';
import { update } from './update';
import { view } from './view';
import { ToDoModel } from './types';


function initModel(): ToDoModel {
	return {
		input: '',
		items: [],
		filter: 'All'
	};
}

document.addEventListener('DOMContentLoaded', _ => {
	let container = document.getElementById('todo-app');
	if (!container)
		throw Error('No "#todo-app" element');
	let todoComponent = {
		view,
		update,
		init: initModel
	};
	runComponent(todoComponent, container, { debug: 'todo' });
});
