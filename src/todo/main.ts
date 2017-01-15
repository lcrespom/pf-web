import { runComponent } from '../yocto';
import { update } from './update';
import { view } from './view';
import { ToDoModel } from './types';


document.addEventListener('DOMContentLoaded', _ => {
	let container = document.getElementById('app');
	if (!container)
		throw Error('No "#app" element');
	let model: ToDoModel = { input: '', items: [], filter: 'All' };
	runComponent(update, view, model, container, true);
});
