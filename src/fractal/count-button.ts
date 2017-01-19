import { Dispatcher, ParentDispatch, makeComponent } from '../yocto';
import H from '../tag-helpers';
import * as R from 'ramda';


interface CountButtonModel {
	count: number;
	eventEvery: number;
}

type CountAction = { inc: number };

type CountDispatcher = Dispatcher<CountButtonModel, CountAction>;

function view(model: CountButtonModel, dispatch: CountDispatcher) {
	return H.button({
		on: { click: _ => dispatch({ inc: 1 }) }
	}, '' + model.count);
}

function update(model: CountButtonModel, action: CountAction,
	onEvent: ParentDispatch): CountButtonModel {
	let newCount = model.count + action.inc;
	if (newCount % model.eventEvery == 0)
		onEvent(newCount);
	return R.merge(model, { count: newCount });
}

function init({ eventEvery = 5 }): CountButtonModel {
	return {
		count: 0,
		eventEvery
	};
}


export const CountButtonComponent = makeComponent({
	init,
	view,
	update
});
