import H from '../tag-helpers';
import { Contact, CrudModel, CrudDispatcher } from './types';
import { FormComponent, FormModel } from './form-cmp';
import { viewCrudTable } from './crud-table-view';
declare const R;


const CONTACT_FIELDS = ['name', 'surname', 'company', 'mobile', 'phone', 'email'];
const CONTACT_LABELS = ['Name', 'Surname', 'Company', 'Mobile', 'Phone', 'e-mail'];


function viewContacts(model: CrudModel, dispatch: CrudDispatcher) {
	let tableData = {
		items: model.contacts,
		fields: CONTACT_FIELDS,
		labels: CONTACT_LABELS
	};
	let handlers = {
		onEdit: item => dispatch({ type: 'edit-contact', contact: item }),
		onRemove: item => alert('ToDo: remove ' + item.name)
	};
	return H.div([
		H.button('.btn.btn-primary', {
			on: { click: _ => dispatch({ type: 'new-contact' })}
		}, 'New contact'),
		viewCrudTable(tableData, handlers)
	]);
}

function viewContactForm(model: Contact, dispatch: CrudDispatcher) {
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

export function view(model: CrudModel, dispatch: CrudDispatcher) {
	return H.div([
		H.h1('CRUD'),
		model.mode == 'table' ?
			viewContacts(model, dispatch) :
			viewContactForm(model.contact, dispatch)
	]);
}
