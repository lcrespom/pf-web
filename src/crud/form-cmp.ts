import { Dispatcher, ParentDispatch, makeComponent } from '../yocto';
import H from '../tag-helpers';
declare const R;


// -------------------- Types --------------------

export interface FormRule {
	type?: string;
	required?: boolean;
	autofocus?: boolean;
}

export interface FormDescriptor {
	fields: string[];
	labels: string[];
	fieldLabels?: string[][];
	rules?: { [field: string]: FormRule };
}

interface FormModel {
	formData: any;
	props: FormDescriptor;
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

function view(model: FormModel, dispatch: FormDispatcher) {
	if (!model.props.fieldLabels) return;
	const updateField = (field, value) => dispatch({
		type: 'update-field', field, value
	});
	return H.div([
		H.form('.form-horizontal', {
			attrs: { action: 'javascript:void(0)' },
			on: { submit: _ => dispatch({ type: 'submit' }) } }, [
			H.div(model.props.fieldLabels.map(([field, label]) =>
				viewFormInput(model, field, label, updateField))),
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
	props.rules = {};
	return {
		formData: {},
		props
	};
}


export const FormComponent = makeComponent({
	init,
	view,
	update
});
