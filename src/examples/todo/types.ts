import { Dispatcher } from '../../yocto';


export type ToDoAction = InputAction | AddAction | ToggleAction | FilterAction;

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


export interface ToDoItem {
	text: string;
	completed: boolean;
}

export interface ToDoModel {
	input: string;
	items: ToDoItem[];
	filter: 'All' | 'Pending' | 'Done';
}

export type ToDoDispatcher = Dispatcher<ToDoModel, ToDoAction>;
