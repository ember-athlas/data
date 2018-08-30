import Component from '@ember/component';
import { layout, tagName } from '@ember-decorators/component';
// @ts-ignore: Ignore import of compiled template
import template from './template';

@layout(template)
@tagName('tbody')
export default class DataTableBody extends Component {

}
