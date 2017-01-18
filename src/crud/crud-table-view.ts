import H from '../tag-helpers';


function actionButton(btnStyle: string, icon: string, text: string,
	item, clicked: (item) => any) {
	return H.a(`.btn.btn-${btnStyle}.btn-sm`,
		{ on: { click: _ => clicked(item) } },
		[
			H.span(`.glyphicon.glyphicon-${icon}`,
				{ attrs: { 'aria-hidden': true } }),
			' ' + text
		]
	);
}

function actionButtons(item, editClicked: (item) => any, removeClicked: (item) => any) {
	return H.td('.text-center.nowrap', [
		actionButton('warning', 'pencil', 'Edit', item, editClicked),
		' ',
		actionButton('danger', 'trash', 'Remove', item, removeClicked)
	]);
}

export function viewCrudTable(items: any[], fields: string[], labels: string[],
	editClicked: (item) => any, removeClicked: (item) => any) {
	return H.table('.table.table-hover', [
		H.thead(
			H.tr(
				[H.th('.text-center.action-col', 'Action')]
				.concat(labels.map(label => H.th(label)))
			)
		),
		H.tbody(items.map(item =>
			H.tr(
				[actionButtons(item, editClicked, removeClicked)]
				.concat(fields.map(field => H.td(item[field])))
			)
		))
	]);
}
