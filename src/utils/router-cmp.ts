import { makeComponent, Dispatcher, VNode } from '../yocto';
import H from '../tag-helpers';
declare const routie;


export interface RouterAction {
	type: 'route';
	route: string;
	args: any[];
}

export interface RouteConfig {
	routes: string[];
	onRoute: (action: RouterAction) => any;
}

interface RouterModel {
	config: RouteConfig;
	routesReady: boolean;
}

type RouterDispatcher = Dispatcher<RouterModel, RouterAction>;


function setupRoutes(model: RouterModel, dispatch: RouterDispatcher) {
	model.config.routes.forEach(route =>
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
	return H.span();
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
