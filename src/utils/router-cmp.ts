import { makeComponent, Dispatcher, ParentDispatch, VNode } from '../yocto';
import H from '../tag-helpers';
declare const routie;


export interface RouterAction {
	type: 'route';
	route: string;
	args: any[];
}

interface RouterModel {
	routes: string[];
	routesReady: boolean;
}

type RouterDispatcher = Dispatcher<RouterModel, RouterAction>;


function setupRoutes(model: RouterModel, dispatch: RouterDispatcher) {
	model.routes.forEach(route =>
		routie(route, (...args) =>
			setTimeout(_ =>
				dispatch({ type: 'route', route, args }),
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

function rUpdate(model: RouterModel, action: RouterAction, onEvent: ParentDispatch): RouterModel {
	onEvent(action);
	return model;
}

function rInit(routes: string[]): RouterModel {
	return {
		routes,
		routesReady: false,
	};
}

export const RouterComponent = makeComponent({
	init: rInit,
	view: rView,
	update: rUpdate
});
