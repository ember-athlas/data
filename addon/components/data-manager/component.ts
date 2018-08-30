import Adapter, { FilterDescriptor, SortDescriptor } from '@ember-athlas/data/components/data-manager/Adapter';
import AdapterFactory from '@ember-athlas/data/components/data-manager/AdapterFactory';
import { layout, tagName } from '@ember-decorators/component';
import { action } from '@ember-decorators/object';
import Component from '@ember/component';
// @ts-ignore: Ignore import of compiled template
import template from './template';

/**
 * Data Manager
 *
 * @yield {Object} data - The yielded API hash
 * @yield {any} data.activeItem - The active item
 * @yield {Function} data.changeActiveItem - Changes active item
 * @yield {Function} data.changeSelection - Changes selection
 * @yield {any[]} data.filteredItems - The filtered items
 * @yield {FilterDescriptor} data.filterDescriptor - The filter descriptor
 * @yield {Function} data.filterItems - Filters items
 * @yield {any[]} data.selection - Selected items
 * @yield {boolean} data.selectEnabled - Whether selection is enabled
 * @yield {boolean} data.selectMultiple - Whether multi selection is enabled
 * @yield {any[]} data.sortedItems - The sorted items
 * @yield {SortDescriptor} data.sortDescriptor - The sort descriptor
 * @yield {Function} data.sortItems - Sorts items
 * @yield {boolean} data.sortMultiple - Whether multiple columns can be sorted
 */
@layout(template)
@tagName('')
export default class DataManager extends Component {
	/**
	 * Either an instance of Adapter or a string which will be passed to the AdapterFactory. Accepted strings are: 'array'
	 * @argument
	 */
	adapter: Adapter = this.adapter || undefined;

	// options
	/**
	 * Enable selection
	 * @argument
	 */
	selectEnabled: boolean = true;

	/**
	 * Enable multi selection
	 * @argument
	 */
	selectMultiple: boolean = false;

	/**
	 * Enable multiple columns to be sorted
	 * @argument
	 */
	sortMultiple: boolean = false;

	// items
	/**
	 * The raw items
	 * @argument
	 */
	items!: any[];
	filteredItems!: any[];
	sortedItems!: any[];

	// active + selection state
	/**
	 * Active item
	 * @argument
	 */
	activeItem: any = null;

	/**
	 * Selected items
	 * @argument
	 */
	selection: any[] = this.selection || [];

	/**
	 * Active item changed listener
	 * @argument
	 */
	activeItemChanged?: Function;

	/**
	 * Selection changed listener
	 * @argument
	 */
	selectionChanged?: Function;

	// sorting + filtering
	/**
	 * Filter descriptor
	 * @argument
	 */
	filterDescriptor: FilterDescriptor = this.filterDescriptor || {};

	/**
	 * Sort descriptor
	 * @argument
	 */
	sortDescriptor: SortDescriptor = this.sortDescriptor || {};

	/**
	 * Filter changed listener
	 * @argument
	 */
	filterChanged?: Function;

	/**
	 * Sort changed listener
	 * @argument
	 */
	sortChanged?: Function;

	constructor() {
		super(...arguments);

		if (!this.adapter) {
			const adapter = typeof (this.adapter) === 'string' ? this.adapter : 'array';
			this.adapter = AdapterFactory.create(adapter)!;
		}

		for (let prop of ['items.[]', 'filterDescriptor']) {
			// @ts-ignore TS can't check for items.[] since it isn't provided as keys to this object
			this.addObserver(prop, () => {
				this.filter();
			});
		}

		for (let prop of ['filteredItems.[]', 'sortDescriptor']) {
			// @ts-ignore TS can't check for filteredItems.[] since it isn't provided as keys to this object
			this.addObserver(prop, () => {
				this.sort();
			});
		}
	}

	/**
	 * Calls filter on the adapter and sets `filteredItems`
	 */
	filter() {
		this.set('filteredItems', this.adapter.filter(this.items, this.filterDescriptor));
	}

	/**
	 * Calls sort on the adapter and sets `sortedItems`
	 */
	sort() {
		this.set('sortedItems', this.adapter.sort(this.filteredItems, this.sortDescriptor));
	}

	@action
	filterItems(desc: FilterDescriptor) {
		if (desc) {
			desc = Object.assign({}, desc);
			if (this.filterChanged) {
				this.filterChanged(desc);
			} else {
				this.set('filterDescriptor', desc);
			}
		} else {
			this.filter();
		}
	}

	@action
	sortItems(desc: SortDescriptor) {
		if (desc) {
			desc = Object.assign({}, desc);
			if (this.sortChanged) {
				this.sortChanged(desc)
			} else {
				this.set('sortDescriptor', desc);
			}
		} else {
			this.sort();
		}
	}

	@action
	changeSelection(selection: any[]) {
		if (this.selectionChanged) {
			this.selectionChanged(selection);
		} else {
			this.set('selection', selection);
		}
	}

	@action
	changeActiveItem(item: any) {
		if (this.activeItemChanged) {
			this.activeItemChanged(item);
		} else {
			this.set('activeItem', item);
		}
	}

}
