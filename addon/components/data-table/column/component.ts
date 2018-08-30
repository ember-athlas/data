import Component from '@ember/component';
import { scheduleOnce } from '@ember/runloop';
// @ts-ignore: Ignore import of compiled template
import template from './template';
import { layout, tagName } from '@ember-decorators/component';
import DataTable from '@ember-athlas/data/components/data-table/component';

@layout(template)
@tagName('')
export default class DataTableColumn extends Component {

	table!: DataTable;

	constructor() {
		super(...arguments);
		if (!this.table.compactScheduled) {
			scheduleOnce('afterRender', this, function() {
				if (!this.table.compact) {
					this.table.set('compact', true);
				}
			});
		}
		this.table.compactScheduled = true;
	}
}
