import Adapter from '@ember-athlas/data/components/data-manager/Adapter';
import ArrayAdapter from '@ember-athlas/data/components/data-manager/ArrayAdapter';

export default class AdapterFactory {
	static create(name: string): Adapter | null {
		switch (name) {
			case 'array':
				return new ArrayAdapter();
		}

		return null;
	}
}
