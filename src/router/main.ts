import { runComponent, makeComponent, Dispatcher, VNode } from '../yocto';
import * as R from 'ramda';
import H from '../tag-helpers';
declare const routie;


// -------------------- Router --------------------

interface RouteConfig {
	routes: string[];
	onRoute: (action: RouterAction) => any;
}

interface RouterModel {
	config: RouteConfig;
	routesReady: boolean;
}

interface RouterAction {
	type: 'route';
	route: string;
	args: any[];
}

export type RouterDispatcher = Dispatcher<RouterModel, RouterAction>;


function setupRoutes(model: RouterModel, dispatch: RouterDispatcher) {
	(model.config.routes).forEach(route =>
		routie(route, (...args) =>
			setTimeout(_ =>
				model.config.onRoute({ type: 'route', route, args }),
			0)
		)
	);
	model.routesReady = true;
}

function rView(model: RouterModel, dispatch: RouterDispatcher): VNode {
	if (!model.routesReady)
		setupRoutes(model, dispatch);
	return(H.span());
}

function rUpdate(model: RouterModel, action: RouterAction): RouterModel {
	return model;
}

function rInit(config: RouteConfig): RouterModel {
	return {
		config,
		routesReady: false,
	};
}

export const RouterComponent = makeComponent({
	init: rInit,
	view: rView,
	update: rUpdate
});


// -------------------- Main app --------------------

interface RtrTstModel {
	name: string;
	view: Function;
}

type RtrTstAction = NameAction | RouterAction;

type NameAction = { type: 'name'; name: string; };

export type RtrTstDispatcher = Dispatcher<RtrTstModel, RtrTstAction>;


function view1(model: RtrTstModel, dispatch: RtrTstDispatcher): VNode {
	return H.div('Hello from view 1, ' + model.name);
}

function view2(model: RtrTstModel, dispatch: RtrTstDispatcher): VNode {
	return H.div('Hello from view 2, ' + model.name);
}

function view(model: RtrTstModel, dispatch: RtrTstDispatcher): VNode {
	const href = url => ({ attrs: { href: url }});
	return H.div([
		H.h1('Router'),
		'What is your name? ',
		H.input({ on: {
			input: evt => dispatch({ type: 'name', name: evt.target.value })
		}}),
		H.br(),
		H.span('Hello ' + model.name),
		H.br(),
		H.a('.btn.btn-default', href('#route1'), 'Route 1'),
		'\u00A0\u00A0',
		H.a('.btn.btn-default', href('#route2'), 'Route 2'),
		RouterComponent({ props: {
			routes: ['route1', 'route2'],
			onRoute: action => dispatch(action)
		}}),
		H.div(model.view(model, dispatch))
	]);
}

function update(model: RtrTstModel, action: RtrTstAction): RtrTstModel {
	const newModel = R.merge(model);
	switch (action.type) {
		case 'route':
			let newView = action.route == 'route1' ? view1 : view2;
			return newModel({ view: newView });
		case 'name':
			return newModel({ name: action.name });
		default:
			return model;
	}
}

function init(): RtrTstModel {
	return {
		name: '',
		view: (model, dispatch) => H.span()
	};
}

document.addEventListener('DOMContentLoaded', () => {
	let container = document.getElementById('route-app');
	if (!container)
		throw Error('No element');
	let rtrTst = { view, update, init };
	runComponent(rtrTst, container);
});
