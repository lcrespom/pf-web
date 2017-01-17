import { Dispatcher, ParentDispatch, makeComponent } from '../yocto';
import H from '../tag-helpers';
declare const R;


// -------------------- Types --------------------

export interface FormRule {
	type?: string;
	required?: boolean;
	autofocus?: boolean;
}

export interface FormModel {
	fields: string[];
	labels: string[];
	formData: any;
	fieldLabels?: string[][];
	rules?: { [field: string]: FormRule };
}

type FormAction = UpdateFieldAction | SubmitAction | CancelAction;

interface UpdateFieldAction {
	type: 'update-field';
	field: string;
	value: string;
}

interface SubmitAction {
	type: 'submit';
}

interface CancelAction {
	type: 'cancel';
}

type FormDispatcher = Dispatcher<FormModel, FormAction>;


// -------------------- View --------------------

function viewFormInput(model: any,
	field: string, label: string, rule: FormRule = {}, changed) {
	let {
		type = 'text',
		required = false,
		autofocus = false
	} = rule;
	return H.div('.form-group', [
		H.label('.control-label.col-sm-3', label),
		H.div('.col-sm-9',
			H.input('.form-control', {
				attrs: {
					value: model[field] || '',
					type, required
				},
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

function view(model: FormModel, dispatch: FormDispatcher) {
	if (!model.fieldLabels) return;
	let rules = model.rules || {};
	const updateField = (field, value) => dispatch({
		type: 'update-field', field, value
	});
	return H.div([
		H.form('.form-horizontal', {
			attrs: { action: 'javascript:void(0)' },
			on: { submit: _ => dispatch({ type: 'submit' }) } }, [
			H.div(model.fieldLabels.map(([field, label]) =>
				viewFormInput(model.formData, field, label,
					rules[field], updateField))),
			viewFormButtons([
				H.button('.btn.btn-primary',
					{ attrs: { type: 'submit' } },
					'Save'),
				H.button('.btn.btn-default', {
					attrs: { type: 'button' },
					on: { click: _ => dispatch({ type: 'cancel' })}
				}, 'Cancel')
			])
		])
	]);
}


// -------------------- Update --------------------

function update(model: FormModel, action: FormAction,
	onEvent: ParentDispatch): FormModel {
	switch (action.type) {
		case 'update-field':
			let formData = R.merge(model.formData, {
				[action.field]: action.value
			});
			return R.merge(model, { formData });
		case 'submit':
			onEvent({ type: 'submit', formData: model.formData });
			return model;
		case 'cancel':
			onEvent({ type: 'cancel' });
			return model;
		default:
			return model;
	}
}


function init(props?: any): FormModel {
	props.fieldLabels = R.zip(props.fields, props.labels);
	props.rules = props.rules || {};
	return props;
}


export const FormComponent = makeComponent({
	init,
	view,
	update
});
