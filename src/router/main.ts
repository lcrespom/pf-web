import { runComponent, makeComponent, Dispatcher, VNode } from '../yocto';
import * as R from 'ramda';
import H from '../tag-helpers';
declare const routie;


// -------------------- Router --------------------

interface RouteConfig {
	[route: string]: Function;
}

interface RouterModel {
	routes: RouteConfig;
	routesReady: boolean;
	view: Function;
}

interface RouterAction {
	route: string;
	args: any[];
}

export type RouterDispatcher = Dispatcher<RouterModel, RouterAction>;


function rInit(routes: RouteConfig): RouterModel {
	return {
		routes,
		routesReady: false,
		view: _ => H.span()
	};
}

function setupRoutes(model: RouterModel, dispatch: RouterDispatcher) {
	Object.keys(model.routes).forEach(key =>
		routie(key, (...args) =>
			setTimeout(_ => dispatch({ route: key, args }), 0)
		)
	);
	model.routesReady = true;
}

function rView(model: RouterModel, dispatch: RouterDispatcher): VNode {
	if (!model.routesReady)
		setupRoutes(model, dispatch);
	//return model.view(model, dispatch);
	let viewCB = model.routes['$view'];
	return viewCB(model.view);
}

function rUpdate(model: RouterModel, action: RouterAction): RouterModel {
	return R.merge(model, { view: model.routes[action.route] });
}

export const RouterComponent = makeComponent({
	init: rInit,
	view: rView,
	update: rUpdate
});


// -------------------- Main app --------------------

interface RtrTstModel { name: string; }

interface RtrTstAction { type: 'name'; name: string; }

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
			route1: view1,
			route2: view2,
			$view: v => v(model, dispatch)
		}})
	]);
}

function update(model: RtrTstModel, action: RtrTstAction): RtrTstModel {
	switch (action.type) {
		case 'name':
			return { name: action.name };
		default:
			return model;
	}
}

document.addEventListener('DOMContentLoaded', () => {
	let container = document.getElementById('route-app');
	if (!container)
		throw Error('No element');
	let rtrTst = { view, update, init: _ => ({ name: '' }) };
	runComponent(rtrTst, container);
});
