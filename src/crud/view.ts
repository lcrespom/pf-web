import H from '../tag-helpers';
import { VNode } from '../yocto';
import { Contact, CrudModel, CrudDispatcher } from './types';
import { FormComponent, FormModel } from '../utils/form-cmp';
import { viewCrudTable, crudEditButton, crudRemoveButton } from '../utils/crud-table-view';


const CONTACT_FIELDS = ['name', 'surname', 'company', 'mobile', 'phone', 'email'];
const CONTACT_LABELS = ['Name', 'Surname', 'Company', 'Mobile', 'Phone', 'e-mail'];


function viewContacts(model: CrudModel, dispatch: CrudDispatcher): VNode {
	let tableData = {
		items: model.contacts,
		fields: CONTACT_FIELDS,
		labels: CONTACT_LABELS
	};
	let buttons = [
		crudEditButton(item => dispatch({ type: 'edit-contact', contact: item })),
		crudRemoveButton(item => confirm(`Remove ${item.name} ${item.surname}?`)
			? dispatch({ type: 'remove-contact', contact: item }) : void(0))
	];
	return H.div([
		H.button('.btn.btn-primary', {
			on: { click: _ => dispatch({ type: 'new-contact' })}
		}, 'New contact'),
		viewCrudTable(tableData, buttons)
	]);
}

function viewContactForm(model: Contact, dispatch: CrudDispatcher): VNode {
	let props: FormModel = {
		formData: model,
		fields: CONTACT_FIELDS,
		labels: CONTACT_LABELS,
		attrs: {
			email: { type: 'email' },
			name: { autofocus: true, required: true }
		},
		submitLabel: 'Save contact'
	};
	const handleFormEvent = evt => {
		switch (evt.type) {
			case 'submit':
				return dispatch({
					type: 'submit-contact',
					contact: evt.formData
				});
			case 'cancel':
				return dispatch({ type: 'cancel-contact' });
		}
	};
	return H.div([
		FormComponent({
			props,
			onEvent: handleFormEvent
		})
	]);
}

export function view(model: CrudModel, dispatch: CrudDispatcher): VNode {
	return H.div([
		H.h1('CRUD'),
		model.mode == 'table' ?
			viewContacts(model, dispatch) :
			viewContactForm(model.contact, dispatch)
	]);
}
