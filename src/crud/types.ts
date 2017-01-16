import { Dispatcher } from '../yocto';


export type CrudAction = SetContactsAction | SetModeAction;

interface SetContactsAction {
	type: 'contacts';
	contacts: Contact[];
}

interface SetModeAction {
	type: 'mode';
	mode: string;
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
