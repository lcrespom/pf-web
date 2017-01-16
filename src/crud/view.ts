import H from '../tag-helpers';
import { Contact, CrudModel, CrudDispatcher } from './types';
declare var R;


const CONTACT_FIELDS = ['name', 'surname', 'company', 'mobile', 'phone', 'email'];
const CONTACT_LABELS = ['Name', 'Surname', 'Company', 'Mobile', 'Phone', 'e-mail'];
const CONTACT_FIELDS_LABELS = R.zip(CONTACT_FIELDS, CONTACT_LABELS);


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

function viewFormInput(model: any, field: string, label: string, changed) {
	return H.div('.form-group', [
		H.label('.control-label.col-sm-3', label),
		H.div('.col-sm-9',
			H.input('.form-control', {
				attrs: { value: model[field] },
				on: { change: evt => changed(field, evt.target.value) }
			})
		)
	]);
}

function viewFormButtons(buttons: any[]) {
	return H.div('.form-group',
		H.div('.col-sm-12.text-center',
			R.intersperse('\u00A0\u00A0\u00A0', buttons))
	);
}

function viewContactForm(model: Contact, dispatch: CrudDispatcher) {
	const updateContact = (field, value) => dispatch({
		type: 'update-contact',
		contact: R.merge(model, { [field]: value })
	});
	return H.div([
		H.form('.form-horizontal', {
			attrs: { action: 'javascript:void(0)' },
			on: { submit: _ => dispatch({ type: 'submit-contact' }) } }, [
			H.div(CONTACT_FIELDS_LABELS.map(([field, label]) =>
				viewFormInput(model, field, label, updateContact))),
			viewFormButtons([
				H.button('.btn.btn-primary',
					{ attrs: { type: 'submit' } },
					'Save contact'),
				H.button('.btn.btn-default', {
					on: { click: _ => dispatch({ type: 'mode', mode: 'table' })}
				}, 'Cancel')
			])
		])
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
