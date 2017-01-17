import { Dispatcher, ParentDispatch } from '../yocto';
import H from '../tag-helpers';
declare const R;


interface CountButtonModel {
	count: number;
	eventEvery: number;
}

type CountAction = { inc: number };

export type CountDispatcher = Dispatcher<CountButtonModel, CountAction>;

function view(model: CountButtonModel, dispatch: CountDispatcher) {
	return H.button({
		on: { click: _ => dispatch({ inc: +1 }) }
	}, '' + model.count);
}

function update(model: CountButtonModel, action: CountAction,
	parentDispatch?: ParentDispatch): CountButtonModel {
	let newCount = model.count + action.inc;
	if (parentDispatch && newCount % model.eventEvery == 0)
		parentDispatch(newCount);
	return R.merge(model, { count: newCount });
}

function init({ eventEvery = 5 }): CountButtonModel {
	return {
		count: 0,
		eventEvery
	};
}

export const CountButtonComponent = {
	init,
	view,
	update
};
