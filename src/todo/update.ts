import { ToDoModel, ToDoAction } from './types';
declare const R;


export function update(model: ToDoModel, action: ToDoAction): ToDoModel {
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
