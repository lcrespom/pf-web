import H from '../tag-helpers';


export interface TableData {
	items: any[];
	fields: string[];
	labels: string[];
}

type ItemAction = (item: any) => any;

export interface ActionHandlers {
	onEdit: ItemAction;
	onRemove: ItemAction;
}


function actionButton(btnStyle: string, icon: string, text: string,
	item: any, clicked: ItemAction) {
	return H.a(`.btn.btn-${btnStyle}.btn-sm`,
		{ on: { click: _ => clicked(item) } },
		[
			H.span(`.glyphicon.glyphicon-${icon}`,
				{ attrs: { 'aria-hidden': true } }),
			' ' + text
		]
	);
}

function actionButtons(item: any, handlers: ActionHandlers) {
	return H.td('.text-center.nowrap', [
		actionButton('warning', 'pencil', 'Edit', item, handlers.onEdit),
		' ',
		actionButton('danger', 'trash', 'Remove', item, handlers.onRemove)
	]);
}

export function viewCrudTable(tableData: TableData, handlers: ActionHandlers) {
	return H.table('.table.table-hover', [
		H.thead(
			H.tr(
				[H.th('.text-center.action-col', 'Action')]
				.concat(tableData.labels.map(label => H.th(label)))
			)
		),
		H.tbody(tableData.items.map(item =>
			H.tr(
				[actionButtons(item, handlers)]
				.concat(tableData.fields.map(field => H.td(item[field])))
			)
		))
	]);
}
