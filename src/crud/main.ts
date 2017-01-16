import { runComponent } from '../yocto';
import { Contact, CrudModel } from './types';
import { view } from './view';
import { update } from './update';


function fetchContacts(): Promise<Contact[]> {
	return new Promise((resolve, reject) => {
		setTimeout(_ => {
			resolve([{
				name: 'Scarlett', surname: 'Johansson', company: 'ABC',
				mobile: '678 123 456', phone: '', email: 'scarlett@abc.com'
			}, {
				name: 'George', surname: 'Clooney', company: 'XYZ',
				mobile: '654 321 987', phone: '', email: 'gclooney@xyz.com'
			}, {
				name: 'Michael', surname: 'Caine', company: 'UK & Co. Ltd.',
				mobile: '', phone: '931 234 567', email: 'michael.caine@xyz.com'
			}]);
		}, 2000);
	});
}


document.addEventListener('DOMContentLoaded', _ => {
	let container = document.getElementById('crud-app');
	if (!container)
		throw Error('No "#crud-app" element');
	let model: CrudModel = {
		contacts: [],
		mode: 'table',
		contact: {
			name: '', surname: '', company: '',
			mobile: '', phone: '', email: ''
		}
	};
	let dispatch = runComponent(update, view, model, container);
	fetchContacts()
	.then(contacts => dispatch({ type: 'contacts', contacts }));
});
