import { CrudModel, CrudAction } from './types';
declare var R;


export function update(model: CrudModel, action: CrudAction): CrudModel {
	let newModel = R.merge(model);
	switch (action.type) {
		case 'contacts':
			return newModel({ contacts: action.contacts });
		case 'mode':
			return newModel({ mode: action.mode });
		default:
			return model;
	}
}
