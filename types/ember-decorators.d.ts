import * as component from '@ember-decorators/component';

declare module '@ember-decorators/component' {
	export function layout(template: any): ClassDecorator;
}
