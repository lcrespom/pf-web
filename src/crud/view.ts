import H from '../tag-helpers';
import { Contact, CrudModel, CrudDispatcher } from './types';


function viewContacts(model: CrudModel, dispatch: CrudDispatcher) {
	return H.div([
		H.button({
			attrs: { class: 'btn btn-primary' },
			on: { click: _ => dispatch({ type: 'mode', mode: 'new' })}
		}, 'New contact'),
		H.table({
			attrs: { class: 'table table-hover'} }, [
			H.thead(
				H.tr([
					H.th('Name'), H.th('Surname'), H.th('Company'),
					H.th('Mobile'), H.th('Phone'), H.th('e-mail')
				])
			),
			H.tbody(model.contacts.map(c =>
				H.tr([
					H.td(c.name), H.td(c.surname), H.td(c.company),
					H.td(c.mobile), H.td(c.phone), H.td(c.email)
				])
			))
		])
	]);
}

function viewContactForm(model: Contact, dispatch: CrudDispatcher) {
	return H.div([
		'ToDo: contact form<br>',
		H.button({
			attrs: { class: 'btn btn-primary' },
			on: { click: _ => dispatch({ type: 'mode', mode: 'table' })}
		}, 'Back to contacts'),
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
