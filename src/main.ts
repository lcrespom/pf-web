declare var require: any;

import snabbdom from 'snabbdom/snabbdom.bundle';
const h = snabbdom.h;

let vnode;
let model = {};

function render() {
	vnode = snabbdom.patch(vnode, view(model));
}

function view(mdl) {
	return h('div', [
		h('h1', 'Hello'),
		'Hello from snabbdom app'
	]);
}

document.addEventListener('DOMContentLoaded', _ => {
	let container = document.getElementById('app');
	vnode = snabbdom.patch(container, view(model));
	render();
});
