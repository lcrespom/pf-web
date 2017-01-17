import vdom from 'snabbdom/snabbdom.bundle';
const { patch: render, h } = vdom;
let global = window as any;


// -------------------- Application entry point --------------------

export type Dispatcher<M, A> = (action: A, newModel?: M) => void;
export type ModelInit<M> = (data?: any) => M;
export type Updater<M, A> = (model: M, action: A, parentDispatch?: ParentDispatch) => M;
export type Renderer<M, A> = (model: M, dispatch: Dispatcher<M, A>) => any;
export type ParentDispatch = (evt: any) => any;

export interface Component<M, A> {
	init: ModelInit<M>;
	view: Renderer<M, A>;
	update: Updater<M, A>;
}

export interface ComponentInit {
	tag?: string;
	data?: any;
	parentDispatch?: ParentDispatch;
	debug?: boolean;
}


export function runComponent<M, A>(component: Component<M, A>,
	domNode: HTMLElement, compInit: ComponentInit = {}): Dispatcher<M, A> {
	let vnode = domNode;
	let { update, view } = component;
	let  { parentDispatch = () => {}, debug = false, data = {} } = compInit;
	let model = component.init(data);
	let dispatch = (action: A, newModel?: M) => {
		model = newModel || update(model, action, parentDispatch);
		if (debug && !newModel)
			global.yocto.push(model);
		vnode = render(vnode, view(model, dispatch));
	};
	vnode = render(vnode, view(model, dispatch));
	if (debug) prepareDebug(model, dispatch);
	return dispatch;
}


// -------------------- Nested component support --------------------

function plugComponent<M, A>(component: Component<M, A>,
	elm: HTMLElement, data: any, parentDispatch: ParentDispatch, debug: boolean) {
	let child = document.createElement('div');
	elm.appendChild(child);
	runComponent(component, child, { data, parentDispatch, debug });
}

export function hComponent<M, A>(cmp: Component<M, A>, compInit: ComponentInit = {}) {
	let {
		tag = 'div',
		data = {},
		parentDispatch = () => {},
		debug = false
	} = compInit;
	return h(tag, {
		hook: {
			create: (e, vnode) => plugComponent(cmp, vnode.elm, data, parentDispatch, debug)
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
