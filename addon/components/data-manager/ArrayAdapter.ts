import Adapter, { FilterDescriptor, SortDescriptor } from '@ember-athlas/data/components/data-manager/Adapter';
import { compare } from '@ember/utils';

export default class ArrayAdapter implements Adapter {

	filter(items: any[], descriptor: FilterDescriptor): any[] {
		const keys = Object.keys(descriptor);
		return items.slice().filter(item => {
			if (keys.length === 0) {
				return true;
			}
			let filtered = true;
			keys.forEach(key => {
				if (prop(item, key) === undefined) {
					filtered = filtered || true;
					return;
				}

				const val = descriptor[key];
				if (typeof val === 'object') {
					if (val.matchSome && Array.isArray(val.matchSome)) {
						let matchSome = false;
						val.matchSome.forEach(some => {
							if (Array.isArray(this.getProp(item, key))) {
								this.getProp(item, key).forEach(prop => {
									matchSome = matchSome || prop === some;
								});
							} else {
								matchSome = matchSome || this.getProp(item, key) === some;
							}
						});
						filtered = filtered && matchSome;
					}

					// if (val.matchEvery && Array.isArray(val.matchEvery)) {
					// 	filtered = filtered || item.get(key).isEvery(val.matchEvery);
					// }
				} else if (typeof val === 'string') {
					filtered = filtered && this.getProp(item, key).contains(val);
				} else {
					filtered = filtered && this.getProp(item, key) === val;
				}
			});

			return filtered;
		});
	}

	private matchSome() {

	}

	sort(items: any[], descriptor: SortDescriptor): any[] {
		return items.slice().sort((itemA, itemB) => {
			for (let prop in descriptor) {
				const direction = descriptor[prop];
				let result = compare(this.getProp(itemA, prop), this.getProp(itemB, prop));
				if (result !== 0) {
					return (direction === 'desc') ? (-1 * result) : result;
				}
			}
			return 0;
		});
	}

	private getProp(item: any, key: string) {
		return item.get ? item.get(key) : item[key];
	}
}
