import { runComponent, Dispatcher, VNode } from '../yocto';
import * as R from 'ramda';
import H from '../tag-helpers';
declare const routie;


// -------------------- Main app --------------------

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
};

export type RouterDispatcher = Dispatcher<RouterModel, RouterAction>;


function setupRoutes(model: RouterModel, dispatch: RouterDispatcher) {
	model.routesReady = true;
	Object.keys(model.routes).forEach(key =>
		routie(key, (...args) =>
			dispatch({ route: key, args }))
	);
}

function view(model: RouterModel, dispatch: RouterDispatcher): VNode {
	if (!model.routesReady)
		setupRoutes(model, dispatch);
	const href = url => ({ attrs: { href: url }});
	return H.div([
		H.h1('Router'),
		H.a('.btn.btn-default', href('#route1'), 'Route 1'),
		'\u00A0\u00A0',
		H.a('.btn.btn-default', href('#route2'), 'Route 2'),
		H.div(model.view(model, dispatch))
	]);
}

function update(model: RouterModel, action: RouterAction): RouterModel {
	return R.merge(model, { view: model.routes[action.route] });
}

function initModel(routes: RouteConfig): RouterModel {
	return {
		routes,
		routesReady: false,
		view: _ => { throw Error('Router error'); }
	};
}


function makeView(tag, text) {
	return function(model, dispatch) {
		return H[tag](text);
	};
}

document.addEventListener('DOMContentLoaded', _ => {
	let container = document.getElementById('route-app');
	if (!container)
		throw Error('No element');
	let routerComponent = { view, update, init: initModel };
	let routes = {
		route1: makeView('h3', 'Hello from view 1'),
		route2: makeView('h3', 'Hello from view 2')
	};
	runComponent(routerComponent, container, { props: routes });
});
