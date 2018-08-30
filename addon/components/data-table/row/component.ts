import DataTableCell from '@ember-athlas/data/components/data-table/cell/component';
import DataTable from '@ember-athlas/data/components/data-table/component';
import { attribute, className, layout, tagName } from '@ember-decorators/component';
import { action, computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import Component from '@ember/component';
// @ts-ignore: Ignore import of compiled template
import template from './template';

@layout(template)
@tagName('tr')
export default class DataTableRow extends Component {

	item!: any;
	table!: DataTable;

	@className('active')
	@computed('table.activeItem')
	get active(): boolean {
		return this.table.activeItem === this.item;
	}

	@className('selected')
	@computed('table.selection.[]')
	get selected(): boolean {
		if (this.item.id) {
			return this.table.selection.mapBy('id').includes(this.item.id);
		}
		return this.table.selection.includes(this.item);
	}

	@attribute('data-item-id')
	@alias('item.id')
	itemId: any;

	@attribute('data-item-index')
	index!: number;

	open: boolean = false;
	cells: DataTableCell[] = [];

	didRender() {
		super.didRender();

		// const namedYield = this.get('element').querySelector('#named-yield-' + this.get('elementId'));
		// if (namedYield) {
		// 	if (this.get('element').nextSibling) {
		// 		this.get('element').parentNode.insertBefore(namedYield, this.get('element').nextSibling);
		// 	} else {
		// 		this.get('element').parentNode.appendChild(namedYield);
		// 	}
		// 	next(this, function() {
		// 		const portal = namedYield.querySelector('div');
		// 		if (portal) {
		// 			Array.from(portal.childNodes).forEach(child => {
		// 				namedYield.appendChild(child);
		// 			});
		// 			namedYield.removeChild(portal);
		// 		}
		// 	});
		// }
	}

	@action
	toggleExpanded() {
		this.toggleProperty('open');
	}

	registerCell(cell: DataTableCell): number {
		if (!this.cells.includes(cell)) {
			this.cells.pushObject(cell);
		}

		return this.cells.indexOf(cell);
	}
}
