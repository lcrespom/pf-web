import { Dispatcher } from '../yocto';


export type CrudAction = SetContactsAction | SetModeAction | SubmitContactAction;

interface SetContactsAction {
	type: 'contacts';
	contacts: Contact[];
}

interface SetModeAction {
	type: 'mode';
	mode: 'new' | 'table';
}

interface SubmitContactAction {
	type: 'submit-contact';
	contact: Contact;
}


export interface Contact {
	name: string;
	surname: string;
	company: string;
	mobile: string;
	phone: string;
	email: string;
}

export interface CrudModel {
	contacts: Contact[];
	contact: Contact;
	mode: string;
}

export type CrudDispatcher = Dispatcher<CrudModel, CrudAction>;

export function emptyContact(): Contact {
	return {
		name: '', surname: '', company: '',
		mobile: '', phone: '', email: ''
	};
}
