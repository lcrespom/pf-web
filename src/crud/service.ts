import { Contact } from './types';


export function fetchContacts(): Promise<Contact[]> {
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
