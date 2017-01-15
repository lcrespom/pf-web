import { runComponent, Dispatcher } from '../yocto';
import H from '../tag-helpers';


type CrudAction = SetContactsAction;

interface SetContactsAction {
	type: 'contacts';
	contacts: Contact[];
}

interface Contact {
	name: string;
	surname: string;
	company: string;
	mobile: string;
	phone: string;
	email: string;
}

interface CrudModel {
	contacts: Contact[];
}

type CrudDispatcher = Dispatcher<CrudModel, CrudAction>;


function viewContacts(model: CrudModel, dispatch: CrudDispatcher) {
	return H.div(model.contacts.map(c =>
		H.div(`Name: ${c.name}, Surname: ${c.surname}`)));
}

function view(model: CrudModel, dispatch: CrudDispatcher) {
	return H.div([
		H.h1('CRUD'),
		viewContacts(model, dispatch)
	]);
}


function update(model: CrudModel, action: CrudAction): CrudModel {
	switch (action.type) {
		case 'contacts':
			model.contacts = action.contacts;	// ToDo: use Ramda
			return model;
		default:
			return model;
	}
}


function fetchContacts(): Promise<Contact[]> {
	return new Promise((resolve, reject) => {
		setTimeout(_ => {
			resolve([{
				name: 'Name1', surname: 'Surname1', company: 'ABC',
				mobile: '678 123 456', phone: '', email: 'name1@abc.com'
			}, {
				name: 'Name2', surname: 'Surname2', company: 'XYZ',
				mobile: '654 321 987', phone: '', email: 'name2@xyz.com'
			}]);
		}, 2000);
	});
}

document.addEventListener('DOMContentLoaded', _ => {
	let container = document.getElementById('crud-app');
	if (!container)
		throw Error('No "#app" element');
	let model: CrudModel = { contacts: [] };
	let dispatch = runComponent(update, view, model, container, true);
	fetchContacts()
	.then(contacts => dispatch({ type: 'contacts', contacts }));
});
