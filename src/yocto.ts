import vdom from 'snabbdom/snabbdom.bundle';
const { patch: render, h } = vdom;
let global = window as any;

export type Dispatcher<M, A> = (action: A, newModel?: M) => void;
export type Updater<M, A> = (model: M, action: A) => M;
export type Renderer<M, A> = (model: M, dispatch: Dispatcher<M, A>) => any;

export interface Component<M, A> {
	init: (data?: any) => M;
	view: (model: M, dispatch: Dispatcher<M, A>) => any;
	update: (model: M, action: A) => M;
}

export function runComponent<M, A>(component: Component<M, A>,
	domNode: HTMLElement, onAction?: ParentDispatch, debugMode?: boolean): Dispatcher<M, A> {
	let vnode = domNode;
	let model = component.init();
	let { update, view } = component;
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


// -------------------- Component support --------------------

export type ParentDispatch = (evt: any) => any;

export interface ComponentInit {
	tag?: string;
	data?: any;
	onAction?: ParentDispatch;
	debug?: boolean;
}

function plugComponent<M, A>(component: Component<M, A>,
	elm: HTMLElement, data: any, onAction: ParentDispatch, debug: boolean) {
	let child = document.createElement('div');
	elm.appendChild(child);
	runComponent(component, child, onAction, debug);
}

export function hComponent<M, A>(cmp: Component<M, A>, compInit: ComponentInit = {}) {
	let {
		tag = 'div',
		data = {},
		onAction = () => {},
		debug = false
	} = compInit;
	return h(tag, {
		hook: {
			create: (e, vnode) => plugComponent(cmp, vnode.elm, data, onAction, debug)
		}
	});
}


// -------------------- Debug support  --------------------

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
