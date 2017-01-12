declare var require: any;

import vdom from 'snabbdom/snabbdom.bundle';
const { h, patch: render } = vdom;

let model = {};

function doClick(evt) {
	console.log('click', this, arguments);
}

function view(mdl) {
	return h('div', [
		h('h1', 'Hello'),
		h('p#pid.cls1.cls2', {
				style: { background: 'cyan' },
				on: { click: [doClick, 1, 2] }
			},
			'Hello from vdom app')
	]);
}

document.addEventListener('DOMContentLoaded', _ => {
	let container = document.getElementById('app');
	let vnode = render(container, view(model));
	// next time: vnode = render(vnode, view(model));
});
