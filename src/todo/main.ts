import { runComponent } from '../yocto';
import { update } from './update';
import { view } from './view';
import { ToDoModel } from './types';


document.addEventListener('DOMContentLoaded', _ => {
	let container = document.getElementById('todo-app');
	if (!container)
		throw Error('No "#todo-app" element');
	let model: ToDoModel = { input: '', items: [], filter: 'All' };
	runComponent(update, view, model, container, true);
});
