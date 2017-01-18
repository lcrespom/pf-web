import { CrudModel, CrudAction, emptyContact } from './types';
declare const R;


export function update(model: CrudModel, action: CrudAction): CrudModel {
	let newModel = R.merge(model);
	let replaceInList = (list, oldElem, newElem) =>
		list.map(item => item === oldElem ? newElem : item);
	switch (action.type) {
		case 'contacts':
			return newModel({ contacts: action.contacts });
		case 'new-contact':
			return newModel({
				mode: 'new',
				contact: emptyContact()
			});
		case 'submit-contact':
			let newContacts = model.mode == 'new'
				? R.append(action.contact, model.contacts)
				: replaceInList(model.contacts, model.contact, action.contact);
			return newModel({
				mode: 'table',
				contacts: newContacts,
				contact: emptyContact()
			});
		case 'cancel-contact':
			return newModel({ mode: 'table' });
		case 'edit-contact':
			return newModel({
				mode: 'edit',
				contact: action.contact
			});
		default:
			return model;
	}
}
