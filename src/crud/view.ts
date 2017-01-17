import H from '../tag-helpers';
import { Contact, CrudModel, CrudDispatcher } from './types';
import { FormComponent, FormDescriptor } from './form-cmp';
declare const R;


const CONTACT_FIELDS = ['name', 'surname', 'company', 'mobile', 'phone', 'email'];
const CONTACT_LABELS = ['Name', 'Surname', 'Company', 'Mobile', 'Phone', 'e-mail'];


function viewCrudTable(items: any[], fields: string[], labels: string[]) {
	return H.table('.table.table-hover', [
		H.thead(
			H.tr(labels.map(label => H.th(label)))
		),
		H.tbody(items.map(item =>
			H.tr(fields.map(field => H.td(item[field])))
		))
	]);
}

function viewContacts(model: CrudModel, dispatch: CrudDispatcher) {
	return H.div([
		H.button('.btn.btn-primary', {
			on: { click: _ => dispatch({ type: 'mode', mode: 'new' })}
		}, 'New contact'),
		viewCrudTable(model.contacts, CONTACT_FIELDS, CONTACT_LABELS)
	]);
}

function viewContactForm(model: Contact, dispatch: CrudDispatcher) {
	let props: FormDescriptor = {
		fields: CONTACT_FIELDS,
		labels: CONTACT_LABELS
	};
	const handleFormEvent = evt => {
		switch (evt.type) {
			case 'submit':
				return dispatch({
					type: 'submit-contact',
					contact: evt.formData
				});
			case 'cancel':
				return dispatch({ type: 'mode', mode: 'table' });
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
