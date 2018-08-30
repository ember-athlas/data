import AddonDocsRouter, { docsRoute } from 'ember-cli-addon-docs/router';
import config from './config/environment';

const Router = AddonDocsRouter.extend({
	location: config.locationType,
	rootURL: config.rootURL,
});

Router.map(function () {
	docsRoute(this, function () {
		this.route('table');
	});

	// this.route('layout', function () {
	// 	this.route('container');
	// 	this.route('page');
	// 	this.route('tab');
	// 	this.route('split');
	// 	this.route('panels');

	// 	this.route('examples', function () {
	// 		this.route('mobile-app');
	// 	});

	// 	this.route('docs', function () {
	// 		this.route('config');
	// 		this.route('styling');
	// 	});

	// 	apiRoute(this, function () {});
	// });

	// this.route('modal', function () {

	// 	apiRoute(this, function () {});
	// });

	this.route('not-found', { path: '/*path' });
});

export default Router;
