import { runComponent } from '../../yocto';
import { CrudModel, emptyContact } from './types';
import { view } from './view';
import { update } from './update';
import { fetchContacts } from './service';


function initModel(): CrudModel {
	return {
		contacts: [],
		mode: 'table',
		contact: emptyContact()
	};
}

document.addEventListener('DOMContentLoaded', _ => {
	let container = document.getElementById('crud-app');
	if (!container)
		throw Error('No "#crud-app" element');
	let crudComponent = {
		view,
		update,
		init: initModel
	};
	let dispatch = runComponent(crudComponent, container);
	fetchContacts()
	.then(contacts => dispatch({ type: 'contacts', contacts }));
});
