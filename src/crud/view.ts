import H from '../tag-helpers';
import { Contact, CrudModel, CrudDispatcher } from './types';


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
		viewCrudTable(model.contacts,
			['name', 'surname', 'company', 'mobile', 'phone', 'email'],
			['Name', 'Surname', 'Company', 'Mobile', 'Phone', 'e-mail'])
	]);
}

/*
<form class="form-horizontal">
	<fieldset style="margin-bottom: 10px">
		<legend>Issuer data</legend>

		<div class="form-group">
			<!-- xfer date: Date, mandatory, default to today -->
			<label class="control-label col-sm-3">Transfer date</label>
			<div class="col-sm-9">
				<input [(ngModel)]="model.xferDate"
					type="date" required class="form-control col-sm-9">
			</div>
		</div>*/
function viewContactForm(model: Contact, dispatch: CrudDispatcher) {
	return H.div([
		//H.br(),
		H.button('.btn.btn-primary', {
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
