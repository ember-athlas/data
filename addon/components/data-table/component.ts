import DataTableColumn from '@ember-athlas/data/components/data-table/column/component';
import SelectionControl from '@ember-athlas/data/components/selection-control/component';
import { attribute, className, classNames, layout, tagName } from '@ember-decorators/component';
// @ts-ignore: Ignore import of compiled template
import template from './template';

@layout(template)
@tagName('table')
@classNames('table', 'data-table')
export default class DataTable extends SelectionControl {
	@className('fixed') fixed: boolean = false;
	@className('highlight-selected') highlightSelected: boolean = true;
	@className('highlight-active') highlightActive: boolean = false;
	@attribute tabindex: number = 0;

	sortMultiple: boolean = false;

	clickTimer?: number;

	compact: boolean = false;
	compactScheduled: boolean = false;
	scrollContainer?: HTMLElement;

	columns: DataTableColumn[] = [];

	didInsertElement() {
		this.element.addEventListener('touchstart', this, {passive: true});
	}

	willDestroyElement() {
		this.element.removeEventListener('touchstart', this);
	}

	getScrollContainer() {
		if (!this.scrollContainer) {
			this.scrollContainer = this.element.querySelector('tbody')!;
		}
		return this.scrollContainer;
	}

	findElement(item: any) {
		return this.getScrollContainer().querySelector(`tr[data-item-id="${item.id}"]`);
	}

	click(e) {
		const item = this.findItem(e);
		if (item) {
			this.trigger('itemClicked', item);
		}
	}

	doubleClick(e) {
		const item = this.findItem(e);
		if (item) {
			this.trigger('itemDoubleClicked', item);
		}
	}

	handleEvent(e: Event) {
		this._super(...arguments);

		if (e.type === 'touchstart') {
			if (!this.clickTimer) {
				this.clickTimer = setTimeout(() => {
					this.clickTimer = undefined;
				}, 500);
			} else {
				clearTimeout(this.clickTimer);
				this.clickTimer = undefined;
				const item = this.findItem(e);
				if (item) {
					this.trigger('itemDoubleClicked', item);
				}
			}
		}
	}

	generateId() {
		return Math.random().toString(32).slice(2).substr(0, 8);
	}

	registerColumn(col: DataTableColumn) {
		if (!this.columns.includes(col)) {
			this.columns.pushObject(col);
		}
	}

	getColumnAt(index: number) {
		if (this.columns[index]) {
			return this.columns[index];
		}

		return undefined;
	}
}
