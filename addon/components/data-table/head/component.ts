import { layout, tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { scheduleOnce } from '@ember/runloop';
// @ts-ignore: Ignore import of compiled template
import template from './template';

@layout(template)
@tagName('thead')
export default class DataTableHead extends Component {

	didInsertElement() {
		scheduleOnce('afterRender', this, () => {
			this.rerender();
		});
	}
}
