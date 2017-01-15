import vdom from 'snabbdom/snabbdom.bundle';
const render = vdom.patch;
let global = window as any;

export type Dispatcher<M, A> = (action: A, newModel?: M) => void;
export type Updater<M, A> = (model: M, action: A) => M;
export type Renderer<M, A> = (model: M, dispatch: Dispatcher<M, A>) => any;

export function runComponent<M, A>(
	update: Updater<M, A>, view: Renderer<M, A>,
	model: M, domNode: HTMLElement, debugMode: boolean = false): Dispatcher<M, A> {
	let vnode = domNode;
	let dispatch = (action: A, newModel?: M) => {
		model = newModel || update(model, action);
		if (debugMode && !newModel)
			global.yocto.push(model);
		vnode = render(vnode, view(model, dispatch));
	};
	vnode = render(vnode, view(model, dispatch));
	if (debugMode) prepareDebug(model, dispatch);
	return dispatch;
}

function prepareDebug<M, A>(initialModel: M, dispatch: Dispatcher<M, A>) {
	global.yocto = new YoctoDebugger<M, A>(dispatch);
	global.yocto.push(initialModel);
}


class YoctoDebugger<M, A> {
	models: M[] = [];
	pos = 0;

	constructor(private dispatch: Dispatcher<M, A>) {}

	push(model: M) {
		this.models.push(model);
		this.pos = this.models.length - 1;
	}

	back(steps = 1) {
		if (this.pos - steps < 0)
			throw Error('Beyond initial state');
		this.pos -= steps;
		this.dispatch({} as A, this.models[this.pos]);
	}

	forward(steps = 1) {
		if (this.pos + steps >= this.models.length)
			throw Error('Beyond final state');
		this.pos += steps;
		this.dispatch({} as A, this.models[this.pos]);
	}
}
