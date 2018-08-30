import { layout, tagName, attribute } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import Component from '@ember/component';
import { scheduleOnce } from '@ember/runloop';
import { htmlSafe } from '@ember/string';
import { isBlank } from '@ember/utils';
// @ts-ignore: Ignore import of compiled template
import template from './template';
import DataTable from '@ember-athlas/data/components/data-table/component';

@layout(template)
@tagName('th')
export default class DataTableHeadColumn extends Component {

	table!: DataTable;

	sortable: boolean = false;
	property?: string;
	width?: string;
	label?: string;

	@computed('sortable', 'property', 'table.sortDescriptor')
	get direction(): string {
		if (this.sortable && this.property) {
			const desc = this.table.sortDescriptor;
			const prop = this.property;
			if (desc.hasOwnProperty(prop)) {
				return desc[prop];
			}
		}
		return '';
	}

	@attribute
	@computed('width')
	get style() {
		let style = '';
		if (!isBlank(this.width)) {
			style = `width: ${this.width};`;
		}
		return htmlSafe(style);
	}

	constructor() {
		super(...arguments);

		this.table.registerColumn(this);
	}

	didRender() {

		// THIS IS FUCKING SUPER-HACKY AND DOESN'T EVEN WORK CORRECTLY. Ember: Give us named blocks
		scheduleOnce('afterRender', this, function() {
			const namedYield = this.get('element').querySelector('.named-yield');
			if (namedYield) {
				const sortNode = this.get('sortable') ? this.get('element').querySelector('.col-sort') : null;
				if (namedYield.style.display !== 'none') {
					// remove non-yielded elements, hide yield
					for (const child of this.element.children) {
						if (child === namedYield) {
							child.style.display = 'none';
						} else if (child !== sortNode) {
							this.element.removeChild(child);
						}
					}
				}

				// move everything from named yield to our element
				const portal = namedYield.querySelector('div');
				for (const child of portal.childNodes) {
					if (sortNode) {
						this.element.insertBefore(child, sortNode);
					} else {
						this.element.appendChild(child);
					}
				}
			}
		});
	}

	mouseUp() {
		this.sort();
	}

	sort() {
		if (!this.sortable) {
			return;
		}

		if (!isBlank(this.property)) {
			const multi = this.table.sortMultiple;
			const prop = this.property;
			let desc = this.table.sortDescriptor;

			if (multi) {
				if (!desc.hasOwnProperty(prop)) {
					desc[prop] = 'asc';
				} else if (desc[prop] === 'asc') {
					desc[prop] = 'desc';
				} else {
					delete desc[prop];
				}
			} else {
				const direction = desc.hasOwnProperty(prop) && desc[prop] === 'asc' ? 'desc' : 'asc';
				desc = {};
				desc[prop] = direction;
			}
			this.table.sortChanged(desc);
		}
	}
}
