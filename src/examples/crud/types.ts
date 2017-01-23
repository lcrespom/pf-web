import { Dispatcher } from '../../yocto';


export type CrudAction = SetContactsAction | NewContactAction |
	SubmitContactAction | EditContactAction | CancelContactAction | RemoveContactAction;

interface SetContactsAction {
	type: 'contacts';
	contacts: Contact[];
}

interface SubmitContactAction {
	type: 'submit-contact';
	contact: Contact;
}

interface NewContactAction {
	type: 'new-contact';
}

interface CancelContactAction {
	type: 'cancel-contact';
}

interface EditContactAction {
	type: 'edit-contact';
	contact: Contact;
}

interface RemoveContactAction {
	type: 'remove-contact';
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
	mode: 'new' | 'edit' | 'table';
}

export type CrudDispatcher = Dispatcher<CrudAction>;

export function emptyContact(): Contact {
	return {
		name: '', surname: '', company: '',
		mobile: '', phone: '', email: ''
	};
}
