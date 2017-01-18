import { CrudModel, CrudAction, emptyContact } from './types';
declare const R;


export function update(model: CrudModel, action: CrudAction): CrudModel {
	let newModel = R.merge(model);
	switch (action.type) {
		case 'contacts':
			return newModel({ contacts: action.contacts });
		case 'new-contact':
			return newModel({
				mode: 'new',
				contact: emptyContact()
			});
		case 'submit-contact':
			return newModel({
				mode: 'table',
				// ToDo: append if mode == 'new', replace if mode == 'edit'
				contacts: R.append(action.contact, model.contacts),
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
