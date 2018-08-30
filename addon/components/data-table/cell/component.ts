import DataTableColumn from '@ember-athlas/data/components/data-table/column/component';
import DataTable from '@ember-athlas/data/components/data-table/component';
import DataTableRow from '@ember-athlas/data/components/data-table/row/component';
import { attribute, layout, tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import Component from '@ember/component';
import { htmlSafe } from '@ember/string';
import { isBlank } from '@ember/utils';
// @ts-ignore: Ignore import of compiled template
import template from './template';

@layout(template)
@tagName('td')
export default class DataTableCell extends Component {

	width?: string;
	column?: DataTableColumn;

	table!: DataTable;
	row!: DataTableRow;
	item!: any;

	@attribute
	@computed('width', 'column.width')
	get style() {
		let style = '';
		if (!isBlank(this.get('width'))) {
			style = `width: ${this.width};`;
		} else if (this.column && !isBlank(this.column.width)) {
			style = `width: ${this.column.width};`;
		}
		return htmlSafe(style);
	}

	constructor() {
		super(...arguments);

		let index = this.row.registerCell(this);
		this.column = this.table.getColumnAt(index);
	}
}
