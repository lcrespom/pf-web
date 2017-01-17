import { CrudModel, CrudAction, emptyContact } from './types';
declare const R;


export function update(model: CrudModel, action: CrudAction): CrudModel {
	let newModel = R.merge(model);
	switch (action.type) {
		case 'contacts':
			return newModel({ contacts: action.contacts });
		case 'mode':
			return newModel({ mode: action.mode });
		case 'submit-contact':
			return newModel({
				contacts: R.append(action.contact, model.contacts),
				contact: emptyContact(),
				mode: 'table'
			});
		default:
			return model;
	}
}
