import H from '../tag-helpers';
import { Contact, CrudModel, CrudDispatcher } from './types';
import { FormComponent, FormModel } from './form-cmp';
declare const R;


const CONTACT_FIELDS = ['name', 'surname', 'company', 'mobile', 'phone', 'email'];
const CONTACT_LABELS = ['Name', 'Surname', 'Company', 'Mobile', 'Phone', 'e-mail'];


function actionButton(btnStyle: string, icon: string, text: string) {
	return H.a(`.btn.btn-${btnStyle}.btn-sm`, [
		H.span(`.glyphicon.glyphicon-${icon}`,
			{ attrs: { 'aria-hidden': true } }),
		' ' + text
	]);
}

function actionButtons() {
	return H.td('.text-center.nowrap', [
		actionButton('warning', 'pencil', 'Edit'),
		' ',
		actionButton('danger', 'trash', 'Remove')
	]);
}

function viewCrudTable(items: any[], fields: string[], labels: string[]) {
	return H.table('.table.table-hover', [
		H.thead(
			H.tr(
				[H.th('.text-center.action-col', 'Action')]
				.concat(labels.map(label => H.th(label)))
			)
		),
		H.tbody(items.map(item =>
			H.tr(
				[actionButtons()]
				.concat(fields.map(field => H.td(item[field])))
			)
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
	let props: FormModel = {
		formData: {},
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
